import torch

from backend.ml.model import DigitClassifier

from backend.ml.evaluate import (
    evaluate_model
)


def evaluate_global_model():

    model_path = (
        "temp_global_model.pth"
    )

    return evaluate_model(
        model_path
    )