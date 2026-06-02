from backend.database.models.global_model import GlobalModel


def create_model_version(
    db,
    round_number,
    model_path
):
    existing = (
        db.query(
            GlobalModel
        )
        .filter(
            GlobalModel.round_number == round_number
        )
        .first()
    )

    if existing:
        # Upsert: update path if round already recorded (e.g. after state desync)
        existing.model_path = model_path
        db.commit()
        db.refresh(existing)
        return existing

    model = GlobalModel(
        round_number=round_number,
        model_path=model_path
    )

    db.add(model)

    db.commit()

    db.refresh(model)

    return model

def get_model_versions(db):

    return (
        db.query(GlobalModel)
        .order_by(GlobalModel.round_number.asc())
        .all()
    )

