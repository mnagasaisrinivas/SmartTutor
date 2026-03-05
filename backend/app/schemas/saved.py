from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict

# ==========================================
#            SAVED ITEM SCHEMAS
#     (Used for DB retrieval / display)
# ==========================================


class SavedQuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    subject: str
    question_text: str
    answer_steps: List[str]
    answer_summary: str
    created_at: datetime  # Python uses datetime, TS uses string


class SavedNoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    subject: str
    topic: str
    heading: str
    bullet_points: List[str]
    created_at: datetime
    saved_date: datetime
