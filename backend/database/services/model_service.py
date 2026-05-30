from backend.database.models.global_model import GlobalModel


def create_model_version(
    db,
    round_number,
    model_path
):

    model = GlobalModel(
        round_number=round_number,
        model_path=model_path
    )

    db.add(model)

    db.commit()

    db.refresh(model)

    return model


def get_model_versions(db):

    return db.query(
        GlobalModel
    ).all()