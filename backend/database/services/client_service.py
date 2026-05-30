from backend.database.models.client import Client


def create_client(
    db,
    client_id: str
):

    existing = db.query(Client).filter(
        Client.client_id == client_id
    ).first()

    if existing:
        return existing

    client = Client(
        client_id=client_id
    )

    db.add(client)

    db.commit()

    db.refresh(client)

    return client

def get_all_clients(db):

    return db.query(Client).all()