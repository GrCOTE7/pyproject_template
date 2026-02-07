"""Configuration centralisée pour FastAPI."""

import os
from typing import List
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()


class Settings:
    """Configuration de l'application FastAPI."""

    # Email (MailHog en local/dev)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "mailpit")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "1025"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_TLS: bool = os.getenv("SMTP_TLS", "False").lower() == "true"
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "noreply@local.test")

    # Environnement
    ENV: str = os.getenv("ENV", "dev")

    # Serveur
    HOST: str = os.getenv("FASTAPI_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("FASTAPI_PORT", "8000"))
    RELOAD: bool = os.getenv("FASTAPI_RELOAD", "True").lower() == "true"

    # CORS
    CORS_ORIGINS: List[str] = os.getenv(
        "FASTAPI_CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
    ).split(",")

    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    # JWT
    JWT_SECRET: str = os.getenv(
        "JWT_SECRET",
        "dev-default-please-change-to-a-secure-32+chars-secret-000",
    )
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_ISSUER: str = os.getenv("JWT_ISSUER", "pyproject_template")

    # Rate limiting (SlowAPI)
    RATE_LIMIT_DEFAULT: str = os.getenv("FASTAPI_RATE_LIMIT_DEFAULT", "60/minute")
    RATE_LIMIT_HEALTH: str = os.getenv("FASTAPI_RATE_LIMIT_HEALTH", "120/minute")
    RATE_LIMIT_HELLO: str = os.getenv("FASTAPI_RATE_LIMIT_HELLO", "30/minute")

    @property
    def is_dev(self) -> bool:
        """Vérifie si on est en mode développement."""
        return self.ENV == "dev"

    @property
    def is_prod(self) -> bool:
        """Vérifie si on est en mode production."""
        return self.ENV == "prod"


settings = Settings()
