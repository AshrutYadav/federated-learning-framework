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

router = APIRouter(prefix="/federated")


@router.get("/status")
def status():
    return {
        "status": "running",
        "clients": len(registered_clients)
    }


@router.post("/register_client")
def register_client(client: ClientRegister):

    if client.client_id not in registered_clients:
        registered_clients.append(client.client_id)

    return {
        "message": "Client registered",
        "client_id": client.client_id
    }


@router.get("/clients")
def get_clients():

    return {
        "clients": registered_clients
    }


@router.post("/submit_weights")
def submit_weights(data: WeightSubmission):

    submitted_updates[data.client_id] = data.weights

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