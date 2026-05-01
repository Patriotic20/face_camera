from typing import Any
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel, PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()

# Project Directories
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class ServerConfig(BaseModel):
    app_path: str
    host: str
    port: int



class JwtConfig(BaseModel):
    access_token_secret: str
    refresh_token_secret: str
    access_token_expires_minutes: int
    refresh_token_expires_days: int
    algorithm: str


class DatabaseConfig(BaseModel):
    url: PostgresDsn
    test_url: PostgresDsn | None = None
    echo: bool = False
    echo_pool: bool = False
    pool_size: int = 50
    max_overflow: int = 10


class AppConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        env_nested_delimiter="__",
        env_prefix="APP_CONFIG__",
        extra="ignore",
    )

    server: ServerConfig
    database: DatabaseConfig
    jwt: JwtConfig




settings = AppConfig()