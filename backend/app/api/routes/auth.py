from datetime import datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.logger import logger
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    limiter,
    verify_password,
    verify_token,
)
from app.db.db import get_db
from app.models.users import RefreshToken, User
from app.schemas.requests import UserLoginRequest, UserSignUpRequest

db_dependency = Annotated[AsyncSession, Depends(get_db)]
user_dependency = Annotated[User, Depends(get_current_user)]

router = APIRouter()


def set_refresh_cookie(response: Response, token: str):
    response.set_cookie(
        key="refresh_token",
        value=token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    )


@router.post("/register")
@limiter.limit("5/minute")
async def signup(
    request: Request,
    user_data: UserSignUpRequest,
    db: db_dependency,
    response: Response,
):
    # Async check if user exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    new_user = User(
        email=user_data.email,
        name=user_data.full_name,
        hashed_password=get_password_hash(user_data.password),
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    access_token = create_access_token(data={"sub": str(new_user.id)})
    refresh_token = create_refresh_token(data={"sub": str(new_user.id)})

    # Store refresh token in DB
    expires_at = datetime.utcnow() + timedelta(
        days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS
    )
    db_refresh_token = RefreshToken(
        user_id=new_user.id, token=refresh_token, expires_at=expires_at
    )
    db.add(db_refresh_token)
    await db.commit()

    set_refresh_cookie(response, refresh_token)

    return {
        "token": access_token,
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.name,
        },
    }


@router.post("/login")
@limiter.limit("10/minute")
async def login(
    request: Request,
    login_data: UserLoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    # Async Fetch User
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    if not user:
        logger.warning(f"Login failed: User with email {login_data.email} not found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not verify_password(login_data.password, user.hashed_password):
        logger.warning(f"Login failed: Incorrect password for user {login_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    logger.info(f"User {user.email} logged in successfully")
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    # Store refresh token in DB
    expires_at = datetime.utcnow() + timedelta(
        days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS
    )
    db_refresh_token = RefreshToken(
        user_id=user.id, token=refresh_token, expires_at=expires_at
    )
    db.add(db_refresh_token)
    await db.commit()

    set_refresh_cookie(response, refresh_token)

    return {
        "token": access_token,
        "user": {"id": user.id, "email": user.email, "full_name": user.name},
    }


@router.post("/refresh")
@limiter.limit("5/minute")
async def refresh_token(request: Request, response: Response, db: db_dependency):
    # Look for token in cookies
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing"
        )

    # Verify the token is mathematically valid
    payload = verify_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload"
        )

    # Check if the token exists in the database
    result = await db.execute(select(RefreshToken).where(RefreshToken.token == token))
    db_token = result.scalar_one_or_none()

    if not db_token:
        logger.warning(
            f"Refresh token reuse or invalid token attempted for user {user_id_str}"
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )

    if db_token.expires_at < datetime.utcnow():
        # Clean up expired token
        await db.delete(db_token)
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )

    # Generate new access token
    new_access_token = create_access_token(data={"sub": user_id_str})

    # We could do token rotation here (issue a new refresh token and delete the old one)
    # For now, we just issue a new access token and keep the old refresh token valid until it expires.

    return {"token": new_access_token}


@router.post("/logout")
async def logout(request: Request, response: Response, db: db_dependency):
    token = request.cookies.get("refresh_token")

    if token:
        # Delete the refresh token from the database
        await db.execute(delete(RefreshToken).where(RefreshToken.token == token))
        await db.commit()

    response.delete_cookie("refresh_token")
    return {"message": "Successfully logged out"}


@router.get("/me")
async def get_me(current_user: user_dependency):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.name,
    }
