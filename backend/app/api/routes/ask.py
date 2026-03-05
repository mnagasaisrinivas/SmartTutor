from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.logger import logger
from app.db.db import get_db
from app.models.question import Question
from app.models.users import User
from app.schemas.requests import QuestionRequest, SaveQuestionRequest
from app.schemas.responses import QuestionExplanation, QuestionResponse
from app.schemas.saved import SavedQuestionResponse
from app.utils.ask_api import get_structured_explanation

router = APIRouter()

db_dependency = Annotated[AsyncSession, Depends(get_db)]
user_dependency = Annotated[User, Depends(get_current_user)]


@router.post("/", response_model=QuestionResponse)
async def ask_question(request_data: QuestionRequest, current_user: user_dependency):
    output = await get_structured_explanation(
        request_data.subject, request_data.question
    )

    explanation = QuestionExplanation(**output.model_dump())
    response = QuestionResponse(
        subject=request_data.subject,
        question=request_data.question,
        explanation=explanation,
    )
    return response


@router.post("/save")
async def save_question(
    request_data: SaveQuestionRequest,
    db: db_dependency,
    current_user: user_dependency,
):
    try:
        new_question = Question(
            user_id=current_user.id,
            subject=request_data.subject,
            question_text=request_data.question,
            answer_summary=request_data.answer_summary,
            answer_steps=request_data.answer_steps,
        )
        db.add(new_question)
        await db.commit()
        return {"message": "Question saved successfully."}
    except SQLAlchemyError as e:
        await db.rollback()
        logger.error(f"Database error while saving question: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save question due to a database error.",
        )


@router.get("/saved", response_model=list[SavedQuestionResponse])
async def get_saved_questions(db: db_dependency, current_user: user_dependency):
    try:
        result = await db.execute(
            select(Question).where(Question.user_id == current_user.id)
        )
        questions = result.scalars().all()
        return questions
    except Exception as e:
        logger.error(f"Error in get_saved_questions: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve saved questions.",
        )


@router.delete("/{question_id}")
async def delete_saved_question(
    question_id: int, db: db_dependency, current_user: user_dependency
):
    try:
        result = await db.execute(
            select(Question).where(
                Question.id == question_id, Question.user_id == current_user.id
            )
        )
        question_to_delete = result.scalars().first()

        if not question_to_delete:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Question not found."
            )

        await db.delete(question_to_delete)
        await db.commit()
        return {"message": "Question deleted successfully."}
    except SQLAlchemyError as e:
        await db.rollback()
        logger.error(f"Database error while deleting question: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete question due to a database error.",
        )
