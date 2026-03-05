from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.models.users import User
from app.schemas.requests import QuizRequest
from app.schemas.responses import QuizQuestionList, QuizResponse
from app.utils.quiz_api import get_quiz_questions

router = APIRouter()

user_dependency = Annotated[User, Depends(get_current_user)]


@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(request_data: QuizRequest, current_user: user_dependency):
    try:
        output = get_quiz_questions(request_data.subject, request_data.topic)
        quiz = QuizQuestionList(**output.model_dump())
        response = QuizResponse(subject=request_data.subject, questions=quiz)
        return response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate quiz: {str(e)}",
        )


# TODO: Implement submit_quiz once QuizResult model is defined
