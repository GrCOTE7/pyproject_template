from fastapi import FastAPI

from .api.router import router as api_router
from .config import settings
from .core.cors import add_cors
from .core.limiter import init_rate_limiting
from .core.logging import configure_logging
from .core.security import jwt_middleware

logger = configure_logging()

app = FastAPI(
    title="Pyproject Template - FastAPI Backend",
    description="Services critiques et performants",
    version="1.0.0",
    docs_url="/docs" if settings.is_dev else None,  # Docs uniquement en dev
)
init_rate_limiting(app)
app.middleware("http")(jwt_middleware)
add_cors(app)

app.include_router(api_router)
