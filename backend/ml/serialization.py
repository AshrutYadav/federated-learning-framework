import torch

def serialize_weights(state_dict):

    serialized = {}

    for key, value in state_dict.items():
        serialized[key] = value.tolist()

    return serialized


def deserialize_weights(weights):

    reconstructed = {}

    for key, value in weights.items():
        reconstructed[key] = torch.tensor(value)

    return reconstructed