import requests

from backend.ml.model import DigitClassifier
from backend.ml.serialization import (
    deserialize_weights,
    serialize_weights
)
from backend.ml.train import train_client

from backend.clients.client_1 import get_client_data


BASE_URL = "http://127.0.0.1:8000/federated"

CLIENT_ID = "client_3"

# Register Client
requests.post(
    f"{BASE_URL}/register_client",
    json={
        "client_id": CLIENT_ID
    }
)

# Download Global Model
response = requests.get(
    f"{BASE_URL}/global_model"
)

data = response.json()

weights = deserialize_weights(
    data["weights"]
)

# Load Model
model = DigitClassifier()

model.load_state_dict(weights)

print("Model Downloaded")

# Train Locally
loader = get_client_data()

updated_weights = train_client(
    model,
    loader
)

print("Local Training Complete")


# Upload Attack

requests.post(
    f"{BASE_URL}/submit_weights",
    json={
        "client_id": CLIENT_ID,

        "weights": serialize_weights(
            updated_weights
        )
    }
)
print("Weights Uploaded")