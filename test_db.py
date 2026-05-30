from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:Ashrut@localhost:5432/federated_learning"

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    result = conn.execute(text("SELECT version();"))
    print(result.fetchone())