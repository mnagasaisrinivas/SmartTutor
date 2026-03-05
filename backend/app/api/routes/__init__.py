from fastapi import APIRouter
from .auth import router as auth_router
from .ask import router as ask_router
from .notes import router as notes_router
from .practice import router as practice_router
from .quiz import router as quiz_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(ask_router, prefix="/ask", tags=["ask"])
api_router.include_router(notes_router, prefix="/notes", tags=["notes"])
api_router.include_router(practice_router, prefix="/practice", tags=["practice"])
api_router.include_router(quiz_router, prefix="/quiz", tags=["quiz"])
