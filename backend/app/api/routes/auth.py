from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.db import get_db
from app.models.users import User
from app.schemas.requests import UserLoginRequest, UserSignUpRequest

db_dependency = Annotated[AsyncSession, Depends(get_db)]
user_dependency = Annotated[User, Depends(get_current_user)]


router = APIRouter()


@router.post("/register")
async def signup(user_data: UserSignUpRequest, db: db_dependency):
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

    token = create_access_token(data={"sub": str(new_user.id)})
    return {
        "token": token,
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.name,
        },
    }


@router.post("/login")
async def login(
    login_data: UserLoginRequest,
    db: AsyncSession = Depends(get_db),
):
    # Async Fetch User
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(data={"sub": str(user.id)})
    return {
        "token": token,
        "user": {"id": user.id, "email": user.email, "full_name": user.name},
    }


@router.get("/me")
async def get_me(current_user: user_dependency):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.name,
    }
