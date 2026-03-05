from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.routes import api_router
from app.core.exceptions import AIGenerationError, SmartTutorException
from app.core.logger import logger, setup_logging
from app.core.security import limiter
from app.db.db import create_db_and_tables

# Initialize logging before startup
setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    logger.info("Starting up SmartTutor API...")
    await create_db_and_tables()
    yield
    logger.info("Shutting down SmartTutor API...")


app = FastAPI(title="SmartTutor API", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore
app.add_middleware(SlowAPIMiddleware)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.exception_handler(AIGenerationError)
async def ai_generation_exception_handler(request: Request, exc: AIGenerationError):
    return JSONResponse(
        status_code=status.HTTP_502_BAD_GATEWAY,
        content={"detail": str(exc)},
    )


@app.exception_handler(SmartTutorException)
async def smart_tutor_exception_handler(request: Request, exc: SmartTutorException):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": str(exc)},
    )


@app.get("/")
async def root():
    return {"message": "Welcome to SmartTutor API"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
