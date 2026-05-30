from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from backend.database.base import Base


class GlobalModel(Base):

    __tablename__ = "global_models"

    id = Column(
        Integer,
        primary_key=True
    )

    round_number = Column(
        Integer,
        nullable=False
    )

    model_path = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )