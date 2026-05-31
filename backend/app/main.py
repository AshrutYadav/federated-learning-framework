from fastapi import FastAPI
from backend.app.routes.federated import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Federated Learning Framework"
)

app.include_router(router)



app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_methods=["*"],

    allow_headers=["*"],

    allow_credentials=True
)