from backend.database.models.experiment import (
    Experiment
)


def create_experiment(
    db,
    round_number,
    accuracy,
    average_trust,
    blocked_clients
):
    existing = (
        db.query(Experiment)
        .filter(Experiment.round_number == round_number)
        .first()
    )

    if existing:
        # Update in place rather than silently returning stale data.
        # This prevents silent data loss if state["current_round"] ever
        # falls out of sync with the DB (e.g., after a server restart).
        existing.accuracy = accuracy
        existing.average_trust = average_trust
        existing.blocked_clients = blocked_clients
        db.commit()
        db.refresh(existing)
        return existing

    row = Experiment(
        round_number=round_number,
        accuracy=accuracy,
        average_trust=average_trust,
        blocked_clients=blocked_clients
    )

    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def get_experiments(
    db
):

    return (
        db.query(Experiment)
        .order_by(Experiment.round_number.asc())
        .all()
    )