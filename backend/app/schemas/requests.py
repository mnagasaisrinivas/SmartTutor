from typing import List

from pydantic import BaseModel, Field


class UserSignUpRequest(BaseModel):
    full_name: str
    email: str
    password: str


class UserLoginRequest(BaseModel):
    email: str
    password: str


class QuestionRequest(BaseModel):
    question: str
    subject: str


class PracticeProblemsRequest(BaseModel):
    subject: str
    topic: str


class StudyNotesRequest(BaseModel):
    topic: str
    subject: str


class QuizRequest(BaseModel):
    subject: str
    topic: str


class SaveQuestionRequest(BaseModel):
    subject: str
    question: str
    # Use default_factory for mutable lists
    answer_steps: List[str] = Field(default_factory=list)
    answer_summary: str


# Helper model for SaveNotesRequest content
class SaveNotesContent(BaseModel):
    heading: str
    bullet_points: List[str] = Field(default_factory=list)


class SaveNotesRequest(BaseModel):
    subject: str
    topic: str
    content: SaveNotesContent
