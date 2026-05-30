from pydantic import BaseModel

class ClientRegister(BaseModel):
    client_id: str