from fastapi import FastAPI
from backend.app.routes.federated import router

app = FastAPI(
    title="Federated Learning Framework"
)

app.include_router(router)