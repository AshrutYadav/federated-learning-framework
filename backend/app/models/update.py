from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from backend.database.base import Base


class ModelUpdate(Base):

    __tablename__ = "model_updates"

    id = Column(
        Integer,
        primary_key=True
    )

    client_id = Column(
        String,
        nullable=False
    )

    round_number = Column(
        Integer,
        nullable=False
    )

    submitted_at = Column(
        DateTime,
        default=datetime.utcnow
    )