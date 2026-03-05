from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.logger import logger
from app.db.db import get_db
from app.models.notes import Note
from app.models.users import User
from app.schemas import SavedNoteResponse, StudyNotesContent, StudyNotesResponse
from app.schemas.requests import SaveNotesRequest, StudyNotesRequest
from app.utils.notes_api import get_study_notes

router = APIRouter()

db_dependency = Annotated[AsyncSession, Depends(get_db)]
user_dependency = Annotated[User, Depends(get_current_user)]


@router.post("/", response_model=StudyNotesResponse)
async def generate_notes(
    request_data: StudyNotesRequest, current_user: user_dependency
):
    output = get_study_notes(request_data.subject, request_data.topic)
    content = StudyNotesContent(**output.model_dump())
    return StudyNotesResponse(
        subject=request_data.subject, topic=request_data.topic, content=content
    )


@router.post("/save")
async def save_notes(
    request_data: SaveNotesRequest, db: db_dependency, current_user: user_dependency
):
    try:
        new_note = Note(
            user_id=current_user.id,
            subject=request_data.subject,
            topic=request_data.topic,
            heading=request_data.content.heading,
            bullet_points=request_data.content.bullet_points,
        )
        db.add(new_note)
        await db.commit()
        return {"message": "Note saved successfully."}
    except SQLAlchemyError as e:
        await db.rollback()
        logger.error(f"Database error while saving note: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save note due to a database error.",
        )


@router.get("/saved", response_model=list[SavedNoteResponse])
async def get_saved_notes(db: db_dependency, current_user: user_dependency):
    try:
        result = await db.execute(select(Note).where(Note.user_id == current_user.id))
        notes_db = result.scalars().all()
        return notes_db
    except Exception as e:
        logger.error(f"Error in get_saved_notes: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve saved notes.",
        )


@router.delete("/{note_id}")
async def delete_saved_note(
    note_id: int, db: db_dependency, current_user: user_dependency
):
    try:
        result = await db.execute(
            select(Note).where(Note.id == note_id, Note.user_id == current_user.id)
        )

        note = result.scalars().first()

        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Note not found."
            )

        await db.delete(note)
        await db.commit()
        return {"message": "Note deleted successfully."}
    except SQLAlchemyError as e:
        await db.rollback()
        logger.error(f"Database error while deleting note: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete note due to a database error.",
        )
