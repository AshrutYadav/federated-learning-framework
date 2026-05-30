from backend.database.models.round import TrainingRound


def get_current_round(db):

    latest = (
        db.query(TrainingRound)
        .order_by(
            TrainingRound.round_number.desc()
        )
        .first()
    )

    if latest:
        return latest.round_number

    first_round = TrainingRound(
        round_number=1
    )

    db.add(first_round)

    db.commit()

    return 1


def increment_round(db):

    current = get_current_round(db)

    new_round = TrainingRound(
        round_number=current + 1
    )

    db.add(new_round)

    db.commit()

    return current + 1