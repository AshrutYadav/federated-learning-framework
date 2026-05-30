from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from backend.database.base import Base


class Client(Base):

    __tablename__ = "clients"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    client_id = Column(
        String,
        unique=True,
        nullable=False
    )