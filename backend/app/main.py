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


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup: sync in-memory round counter from the database ──────────
    # state["current_round"] is hard-coded to 1 in state.py.
    # Every uvicorn --reload restart resets it to 1 even though the DB may
    # be at round 8, 11, etc.  When aggregation then runs it calls
    # create_experiment(db, state["current_round"]=1, ...) which finds an
    # existing row for round 1 and silently does nothing, while the
    # TrainingRound counter keeps incrementing — producing the gap where
    # the dashboard shows Round 11 but only 7 experiment records exist.
    db = SessionLocal()
    try:
        db_round = get_current_round(db)
        state["current_round"] = db_round
        print(f"[startup] state['current_round'] synced from DB → {db_round}")
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