from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.users import User
from app.schemas.requests import QuizRequest
from app.schemas.responses import QuizQuestionList, QuizResponse
from app.utils.quiz_api import get_quiz_questions

router = APIRouter()

user_dependency = Annotated[User, Depends(get_current_user)]


@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(request_data: QuizRequest, current_user: user_dependency):
    output = get_quiz_questions(request_data.subject, request_data.topic)
    quiz = QuizQuestionList(**output.model_dump())
    response = QuizResponse(subject=request_data.subject, questions=quiz)
    return response

# TODO: Implement submit_quiz once QuizResult model is defined
