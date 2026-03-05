from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
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
    try:
        output = get_study_notes(request_data.subject, request_data.topic)
        content = StudyNotesContent(**output.model_dump())
        return StudyNotesResponse(
            subject=request_data.subject, topic=request_data.topic, content=content
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate notes: {str(e)}",
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
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save note: {str(e)}",
        )


@router.get("/saved", response_model=list[SavedNoteResponse])
async def get_saved_notes(db: db_dependency, current_user: user_dependency):
    try:
        result = await db.execute(select(Note).where(Note.user_id == current_user.id))
        notes = result.scalars().all()

        return notes

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve saved notes: {str(e)}",
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

    except HTTPException:
        raise

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete note: {str(e)}",
        )
