import requests

from backend.ml.model import DigitClassifier
from backend.ml.serialization import (
    deserialize_weights,
    serialize_weights
)
from backend.ml.train import train_client

from backend.clients.client_6 import get_client_data


import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:8000/federated")

CLIENT_ID = "client_6"

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

# ── ATTACK: Poison the weights (multiply by 1000) ──────────────────────────
print("Injecting malicious weights...")
poisoned_weights = {k: v * 1000 for k, v in updated_weights.items()}

# Upload Poisoned Weights
response = requests.post(
    f"{BASE_URL}/submit_weights",
    json={
        "client_id": CLIENT_ID,
        "weights": serialize_weights(
            poisoned_weights
        )
    }
)

if not response.ok:
    print(f"ERROR: Server rejected weights — {response.status_code}: {response.text}")
else:
    print(f"Weights Uploaded | Server: {response.json().get('message')}")
