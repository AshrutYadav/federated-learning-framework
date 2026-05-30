from sqlalchemy import Column
from sqlalchemy import Integer

from backend.database.base import Base


class TrainingRound(Base):

    __tablename__ = "training_rounds"

    id = Column(
        Integer,
        primary_key=True
    )

    round_number = Column(
        Integer,
        nullable=False
    )