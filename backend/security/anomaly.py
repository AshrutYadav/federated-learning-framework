import numpy as np


def detect_malicious_update(
    weights
):

    values = []

    for layer in weights.values():

        flat = np.array(
            layer
        ).flatten()

        values.extend(
            flat
        )

    mean = np.mean(
        np.abs(values)
    )

    print(
        f"Anomaly score: {mean}"
    )
    THRESHOLD = 5
    return mean > THRESHOLD