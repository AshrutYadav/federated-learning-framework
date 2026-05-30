from backend.database.models.client import Client
from backend.database.models.update import ModelUpdate
from backend.database.models.round import TrainingRound


def get_metrics(db):

    total_clients = db.query(
        Client
    ).count()

    total_updates = db.query(
        ModelUpdate
    ).count()

    latest_round = (
        db.query(TrainingRound)
        .order_by(
            TrainingRound.round_number.desc()
        )
        .first()
    )

    current_round = (
        latest_round.round_number
        if latest_round
        else 1
    )

    return {
        "current_round": current_round,
        "total_clients": total_clients,
        "total_updates": total_updates
    }