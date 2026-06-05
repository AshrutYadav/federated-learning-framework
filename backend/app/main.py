from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes.federated import router
from backend.app.core.state import state
from backend.database.connection import SessionLocal, engine
from backend.database.base import Base

# Import all models so their metadata is registered with Base before create_all
from backend.database.models.client import Client  # noqa: F401
from backend.database.models.round import TrainingRound  # noqa: F401
from backend.database.models.update import ModelUpdate  # noqa: F401
from backend.database.models.global_model import GlobalModel  # noqa: F401
from backend.database.models.experiment import Experiment  # noqa: F401

from backend.database.services.round_service import get_current_round
from backend.database.services.client_service import get_all_clients

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup: ensure all tables exist, then sync in-memory state ───────

    # Step 0: Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    from sqlalchemy import inspect

    print("=== REGISTERED MODELS ===")
    print(list(Base.metadata.tables.keys()))

    inspector = inspect(engine)

    print("=== TABLES IN DATABASE ===")
    print(inspector.get_table_names())

    print("[startup] Database tables verified / created")

    db = SessionLocal()
    try:
        # 1. Restore current round counter
        db_round = get_current_round(db)
        state["current_round"] = db_round
        print(f"[startup] state['current_round'] synced from DB → {db_round}")

        # 2. Restore trust scores from the DB for every registered client.
        #    Each client's trust_score column holds the last persisted value,
        #    so scores correctly survive server restarts / --reload cycles.
        clients = get_all_clients(db)
        for client in clients:
            if client.client_id not in state["trust_scores"]:
                state["trust_scores"][client.client_id] = client.trust_score
        print(f"[startup] trust_scores restored for {len(clients)} client(s)")
    finally:
        db.close()

    yield   # server runs here

    # Shutdown: nothing special needed


app = FastAPI(
    title="Federated Learning Framework",
    lifespan=lifespan
)

app.include_router(router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:5173")
    ],

    allow_methods=["*"],

    allow_headers=["*"],

    allow_credentials=True
)