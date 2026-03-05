import os

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

DOTENV = os.path.join(os.path.dirname(__file__), "..", "..", ".env")


class Settings(BaseSettings):
    # Database Config
    DATABASE_URL: str

    # JWT Config
    JWT_SECRET_KEY: SecretStr
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Groq Config
    GROQ_API_KEY: str

    # This tells Pydantic to read from a .env file
    model_config = SettingsConfigDict(env_file=DOTENV, env_file_encoding="utf-8")


settings = Settings()  # pyright: ignore[reportCallIssue]
