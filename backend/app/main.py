from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes.federated import router
from backend.app.core.state import state
from backend.database.connection import SessionLocal
from backend.database.services.round_service import get_current_round


from backend.database.services.client_service import get_all_clients

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup: sync in-memory state from the database ──────────────────
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

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:5173")
    ],

    allow_methods=["*"],

    allow_headers=["*"],

    allow_credentials=True
)