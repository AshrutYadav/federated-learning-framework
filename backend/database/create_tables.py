from backend.database.connection import engine

from backend.database.base import Base

from backend.database.models.client import Client
from backend.database.models.round import TrainingRound
from backend.database.models.update import ModelUpdate
from backend.database.models.global_model import GlobalModel

Base.metadata.create_all(bind=engine)

print("Tables Created")