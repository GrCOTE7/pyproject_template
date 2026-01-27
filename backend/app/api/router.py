from fastapi import APIRouter

from .routes.health import router as health_router
from .routes.hello import router as hello_router

router = APIRouter()

router.include_router(health_router, prefix="/api")
router.include_router(hello_router, prefix="/api")

# Versioning
router.include_router(health_router, prefix="/api/v1")
router.include_router(hello_router, prefix="/api/v1")
