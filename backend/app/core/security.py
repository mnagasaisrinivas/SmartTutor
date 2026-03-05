from datetime import UTC, datetime, timedelta
from typing import Optional

import jwt
from pwdlib import PasswordHash

from .config import settings

# This automatically configures Argon2id with secure defaults
password_hash = PasswordHash.recommended()


def get_password_hash(password: str) -> str:
    """Hashes a password using Argon2id."""
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored hash."""
    return password_hash.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Creates JWT Access Token"""

    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire, "type": "access"})

    encoded_access_token = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY.get_secret_value(), algorithm=settings.ALGORITHM
    )
    return encoded_access_token


def create_refresh_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Creates JWT Refresh Token"""

    to_encode = data.copy()

    expire = datetime.now(UTC) + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)

    to_encode.update({"exp": expire, "type": "refresh"})

    encoded_refresh_token = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY.get_secret_value(), algorithm=settings.ALGORITHM
    )
    return encoded_refresh_token


def verify_token(token: str) -> Optional[dict]:
    """
    Decodes a JWT token and returns the payload if valid.
    Returns None if the token is invalid or expired.
    """
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY.get_secret_value(), algorithms=[settings.ALGORITHM]
        )
        return payload
    except (jwt.PyJWTError, jwt.ExpiredSignatureError):
        # PyJWTError catches all JWT errors (invalid signature, malformed, etc.)
        return None
