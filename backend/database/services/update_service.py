from backend.database.models.update import ModelUpdate


def create_update(
    db,
    client_id,
    round_number
):

    update = ModelUpdate(
        client_id=client_id,
        round_number=round_number
    )

    db.add(update)

    db.commit()

    db.refresh(update)

    return update

def get_all_updates(db):

    return db.query(
        ModelUpdate
    ).all()