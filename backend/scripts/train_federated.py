import torch

from backend.ml.model import DigitClassifier
from backend.ml.train import train_client
from backend.ml.aggregate import federated_average
from backend.ml.evaluate import evaluate_model

from backend.clients.client_1 import get_client_data as client1
from backend.clients.client_2 import get_client_data as client2
from backend.clients.client_3 import get_client_data as client3


NUM_ROUNDS = 5

client_loaders = [
    client1(),
    client2(),
    client3()
]


global_model = DigitClassifier()

for round_num in range(NUM_ROUNDS):


    print(f"\n===== Round {round_num + 1} =====")

    client_weights = []

    for idx, loader in enumerate(client_loaders):

        print(f"Training Client {idx + 1}")

        local_model = DigitClassifier()

        local_model.load_state_dict(
            global_model.state_dict()
        )

        weights = train_client(
            local_model,
            loader
        )

        client_weights.append(weights)

    global_weights = federated_average(
        client_weights
    )

    global_model.load_state_dict(
        global_weights
    )

torch.save(
    global_model.state_dict(),
    "global_model.pth"
)

evaluate_model("global_model.pth")