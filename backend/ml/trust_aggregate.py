import torch

def trust_average(
    client_weights,
    trust_scores
):
    result = {}
    total = sum(trust_scores)

    for key in client_weights[0]:
        weighted = []
        for i, w in enumerate(client_weights):
            weighted.append(
                w[key] * (trust_scores[i]/total)
            )

        result[key] = sum(weighted)

    return result