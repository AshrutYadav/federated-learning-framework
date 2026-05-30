from pydantic import BaseModel
from typing import Dict, Any

class WeightSubmission(BaseModel):
    client_id: str
    weights: Dict[str, Any]