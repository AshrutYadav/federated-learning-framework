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

from backend.security.trust import (

reduce_score,

get_score

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



@router.post("/submit_weights")
def submit_weights(
    data: WeightSubmission,
    db: Session = Depends(get_db)
):
    if detect_malicious_update(data.weights):
        print(f"ATTACK DETECETD: {data.client_id}")
        trust=reduce_score(data.client_id)
        print(state["trust_scores"])
        state["blocked_clients"] += 1
        state["blocked_list"].append(data.client_id)
        return{
            "message": "Blocked",
            "trust": trust

        }

    if get_score(data.client_id)<=20:
        return{
            "message":"Client Banned"
        }

    submitted_updates[data.client_id] = data.weights
    print(
        f"Updates count: {len(submitted_updates)}"
    )   

    if len(submitted_updates) >= 3:

        print("ENTERED AGGREGATION BLOCK")

    create_update(
        db,
        data.client_id,
        get_current_round(db)
    )

    print(
        f"Received update from {data.client_id}"
    )

    if len(submitted_updates) >= 3:

        print("All clients submitted")

        client_weights = []

        for update in submitted_updates.values():

            client_weights.append(
                deserialize_weights(update)
            )

        averaged_weights = federated_average(
            client_weights
        )

        model.load_state_dict(
            averaged_weights
        )

        os.makedirs(
            "models",
            exist_ok=True
        )

        model_path = (
            f"models/global_round_"
            f"{state['current_round']}.pth"
        )

        torch.save(
            model.state_dict(),
            model_path
        )
        create_model_version(
            db,
            state["current_round"],
            model_path
        )

        print(
            f"Model saved: {model_path}"
        )
        
        print(
            os.path.abspath(model_path)
        )

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