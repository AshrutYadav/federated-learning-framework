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


def delete_client(db, client_id: str) -> bool:
    """Delete a client by client_id. Returns True if deleted, False if not found."""
    client = db.query(Client).filter(
        Client.client_id == client_id
    ).first()

    if not client:
        return False

    db.delete(client)
    db.commit()
    return True


def delete_all_clients(db) -> int:
    """Delete all clients. Returns count of deleted rows."""
    count = db.query(Client).count()
    db.query(Client).delete()
    db.commit()
    return count


def update_client_trust(db, client_id: str, score: int) -> int:
    """Persist a client's trust score to the DB. Returns the saved score."""
    clamped = max(0, min(100, score))
    client = db.query(Client).filter(Client.client_id == client_id).first()
    if client:
        client.trust_score = clamped
        db.commit()
    return clamped


def get_client_trust(db, client_id: str) -> int:
    """Read a client's trust score from the DB. Returns 100 if not found."""
    client = db.query(Client).filter(Client.client_id == client_id).first()
    if client:
        return client.trust_score
    return 100