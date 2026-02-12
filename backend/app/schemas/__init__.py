from .requests import (
    PracticeProblemsRequest,
    QuestionRequest,
    QuizRequest,
    SaveNotesRequest,
    SaveQuestionRequest,
    StudyNotesRequest,
    UserLoginRequest,
    UserSignUpRequest,
)
from .responses import (
    PracticeProblemsResponse,
    QuestionResponse,
    QuizResponse,
    StudyNotesResponse,
)
from .saved import SavedNote, SavedQuestion

# Define what is exported when someone does: from app.schemas import *
__all__ = [
    # Requests
    "QuestionRequest",
    "PracticeProblemsRequest",
    "StudyNotesRequest",
    "QuizRequest",
    "SaveQuestionRequest",
    "SaveNotesRequest",
    "UserSignUpRequest",
    "UserLoginRequest",
    # Responses
    "QuestionResponse",
    "PracticeProblemsResponse",
    "StudyNotesResponse",
    "QuizResponse",
    # Saved Items
    "SavedQuestion",
    "SavedNote",
]
