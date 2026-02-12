from typing import List, Optional

from pydantic import BaseModel

# ==========================================
#               RESPONSE MODELS
# ==========================================


class QuestionExplanation(BaseModel):
    steps: Optional[List[str]] = None
    title: Optional[str] = None
    summary: Optional[str] = None


class QuestionResponse(BaseModel):
    subject: str
    topic: str
    explanation: QuestionExplanation


class PracticeProblemsData(BaseModel):
    practice_problems: List[str]
    explanations: List[str]


class PracticeProblemsResponse(BaseModel):
    subject: str
    topic: str
    problems: PracticeProblemsData


class StudyNotesContent(BaseModel):
    heading: str
    bullet_points: List[str]


class StudyNotesResponse(BaseModel):
    topic: str
    subject: str
    content: StudyNotesContent


class QuizQuestionItem(BaseModel):
    id: int
    question: str
    options: List[str]
    correctAnswer: int


class QuizQuestionList(BaseModel):
    questions: List[QuizQuestionItem]


class QuizResponse(BaseModel):
    subject: str
    questions: QuizQuestionList
