from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Float, Integer

from backend.database.base import Base


class Experiment(Base):

    __tablename__ = "experiments"

    id = Column(
        Integer,
        primary_key=True
    )

    round_number = Column(
        Integer
    )

    accuracy = Column(
        Float
    )

    average_trust = Column(
        Float
    )

    blocked_clients = Column(
        Integer
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )