from datetime import datetime
from typing import List

from pydantic import BaseModel

# ==========================================
#            SAVED ITEM SCHEMAS
#     (Used for DB retrieval / display)
# ==========================================


class SavedQuestion(BaseModel):
    id: int
    subject: str
    question_text: str
    answer_steps: List[str]
    answer_summary: str
    created_at: datetime  # Python uses datetime, TS uses string

    class Config:
        from_attributes = True  # Allows reading directly from SQLAlchemy models


class SavedNote(BaseModel):
    id: int
    subject: str
    topic: str
    heading: str
    bullet_points: List[str]
    created_at: datetime

    class Config:
        from_attributes = True
