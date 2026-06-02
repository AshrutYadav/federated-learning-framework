from fastapi import APIRouter
from backend.app.schemas.client import ClientRegister
from backend.app.schemas.weights import WeightSubmission
from backend.app.core.model_manager import model
from backend.ml.serialization import serialize_weights
from backend.app.core.state import (
    registered_clients,
    submitted_updates,
    state
)
import torch
import os

from backend.security.anomaly import (
    detect_malicious_update
)
from backend.database.services.round_service import (
    get_current_round,
    increment_round
)
from backend.database.services.model_service import (
    create_model_version,
    get_model_versions
)
from backend.database.services.metrics_service import (
    get_metrics
)

from backend.database.services.update_service import (
    get_all_updates
)
from fastapi import Depends
from sqlalchemy.orm import Session
from backend.database.dependencies import get_db
from backend.database.services.update_service import (
    create_update
)
from backend.database.services.round_service import (
    get_current_round
)
from sqlalchemy.orm import Session
from fastapi import Depends
from backend.database.dependencies import get_db
from backend.database.services.client_service import (
    create_client,
    get_all_clients
)
from backend.database.services.round_service import (
    get_current_round
)
from backend.ml.aggregate import federated_average
from backend.ml.serialization import deserialize_weights
from backend.app.core.model_manager import model
from backend.security.trust import (reduce_score,get_score)
from backend.ml.trust_aggregate import (
    trust_average
)

from backend.database.services.experiment_service import (
    create_experiment
)


from backend.database.services.experiment_service import (
    get_experiments
)


from backend.ml.evaluate_global import (
    evaluate_global_model
)

router = APIRouter(prefix="/federated")


@router.get("/status")
def status():
    return {
        "status": "running",
        "clients": len(registered_clients)
    }


@router.post("/register_client")
def register_client(
    client: ClientRegister,
    db: Session = Depends(get_db)
):

    saved_client = create_client(
        db,
        client.client_id
    )

    if client.client_id not in state["trust_scores"]:
        state["trust_scores"][
            client.client_id
        ] = 100

    return {
        "message": "Client registered",
        "client_id": saved_client.client_id
    }



@router.get("/clients")
def get_clients(
    db: Session = Depends(get_db)
):

    clients = get_all_clients(db)

    return {
        "clients": [
            c.client_id
            for c in clients
        ]
    }



MIN_CLIENTS = 2


@router.post("/submit_weights")
def submit_weights(
    data: WeightSubmission,
    db: Session = Depends(get_db)
):
    # ── Step 1: Anomaly detection ─────────────────────────────────────────
    # A malicious client is blocked and its trust reduced, but we do NOT
    # return early here. Returning early was the root bug: it prevented the
    # remaining valid updates from ever reaching the aggregation threshold.
    is_malicious = detect_malicious_update(data.weights)

    if is_malicious:
        print(f"ATTACK DETECTED: {data.client_id}")
        trust = reduce_score(data.client_id)
        print(state["trust_scores"])
        state["blocked_clients"] += 1
        state["blocked_list"].append(data.client_id)
        return {
            "message": "Blocked",
            "trust": trust
        }

    # ── Step 2: Permanently banned client check ───────────────────────────
    if get_score(data.client_id) <= 20:
        return {
            "message": "Client Banned"
        }

    # ── Step 3: Accept the valid update ───────────────────────────────────
    submitted_updates[data.client_id] = data.weights

    create_update(
        db,
        data.client_id,
        get_current_round(db)
    )

    print(
        f"Received update from {data.client_id} "
        f"| total valid updates: {len(submitted_updates)}"
    )

    # ── Step 4: Aggregate when enough valid clients have submitted ─────────
    if len(submitted_updates) >= MIN_CLIENTS:

        print("All required clients submitted — running aggregation")

        client_weights = []
        trust_scores = []

        for client_id, update in submitted_updates.items():
            client_weights.append(
                deserialize_weights(update)
            )
            trust_scores.append(
                get_score(client_id)
            )

        print("Trust scores:", trust_scores)

        averaged_weights = trust_average(
            client_weights,
            trust_scores
        )

        model.load_state_dict(averaged_weights)

        torch.save(
            model.state_dict(),
            "temp_global_model.pth"
        )

        avg_trust = sum(trust_scores) / len(trust_scores)
        accuracy = evaluate_global_model()

        create_experiment(
            db,
            state["current_round"],
            accuracy,
            avg_trust,
            state["blocked_clients"]
        )

        os.makedirs("models", exist_ok=True)

        model_path = (
            f"models/global_round_{state['current_round']}.pth"
        )

        torch.save(model.state_dict(), model_path)

        create_model_version(
            db,
            state["current_round"],
            model_path
        )

        print(f"Model saved: {model_path}")
        print(os.path.abspath(model_path))

        submitted_updates.clear()

        new_round = increment_round(db)
        state["current_round"] = new_round

    return {
        "message": "Weights received",
        "client": data.client_id
    }

@router.get("/updates")
def get_updates():
    return {
        "received_from": list(submitted_updates.keys())
    }




@router.get("/global_model")
def get_global_model():

    return {
        "round": state["current_round"],
        "weights": serialize_weights(
            model.state_dict()
        )
    }


@router.get("/training_status")
def training_status():

    return {
        "current_round":
            state["current_round"],

        "registered_clients":
            len(registered_clients),

        "received_updates":
            len(submitted_updates)
    }


@router.get("/round")
def get_round(
    db: Session = Depends(get_db)
):

    return {
        "round": get_current_round(db)
    }


@router.get("/update_history")
def update_history(
    db: Session = Depends(get_db)
):

    updates = get_all_updates(db)

    return {
        "updates": [
            {
                "client_id": u.client_id,
                "round": u.round_number
            }
            for u in updates
        ]
    }

@router.get("/metrics")
def metrics(
    db: Session = Depends(get_db)
):

    return get_metrics(db) 



@router.get("/model_versions")
def model_versions(
    db: Session = Depends(get_db)
    ):

    models = get_model_versions(db)

    return {
        "versions": [
            {
                "round": m.round_number,
                "path": m.model_path
            }
            for m in models
        ]
    }


@router.get("/blocked_clients")
def blocked_clients():

    return{
        "blocked":state["blocked_list"]
        }


@router.get("/trust")
def trust():

    return{
        "scores":state["trust_scores"]
        }


@router.get("/experiments")
def experiments(
    db: Session = Depends(get_db)
):

    rows = get_experiments(db)

    return {

        "experiments": [

            {

                "round":
                    r.round_number,

                "accuracy":
                    r.accuracy,

                "avg_trust":
                    r.average_trust,

                "blocked":
                    r.blocked_clients

            }

            for r in rows

        ]

    }



