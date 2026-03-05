from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.models.users import User
from app.schemas.requests import PracticeProblemsRequest
from app.schemas.responses import PracticeProblemsData, PracticeProblemsResponse
from app.utils.practice_api import get_practice_problems

router = APIRouter()

user_dependency = Annotated[User, Depends(get_current_user)]


@router.post("/", response_model=PracticeProblemsResponse)
async def generate_practice(
    request_data: PracticeProblemsRequest, current_user: user_dependency
):
    try:
        output = get_practice_problems(request_data.subject, request_data.topic)
        problems = PracticeProblemsData(**output.model_dump())
        response = PracticeProblemsResponse(
            subject=request_data.subject, topic=request_data.topic, problems=problems
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate practice problems: {str(e)}",
        )
