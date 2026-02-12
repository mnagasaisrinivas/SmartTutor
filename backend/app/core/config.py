from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database Config
    DATABASE_URL: str

    # JWT Config
    JWT_SECRET_KEY: SecretStr
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # This tells Pydantic to read from a .env file
    model_config = SettingsConfigDict(env_file=".env")
