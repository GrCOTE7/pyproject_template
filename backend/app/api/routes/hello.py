from fastapi import APIRouter, Depends, Request

from ...core.dependencies import get_current_admin, get_current_user
from ...core.limiter import limiter
from ...schemas.hello import AdminHelloResponse, HelloResponse
from ...services.hello_service import (
    build_admin_hello_response,
    build_hello_response,
)
from ...config import settings

router = APIRouter()


@router.get("/hello", response_model=HelloResponse)
@limiter.limit(settings.RATE_LIMIT_HELLO)
def hello(
    request: Request,
    user: dict = Depends(get_current_user),
):
    return build_hello_response(user)


@router.get("/admin/hello", response_model=AdminHelloResponse)
@limiter.limit(settings.RATE_LIMIT_HELLO)
def admin_hello(
    request: Request,
    user: dict = Depends(get_current_admin),
):
    return build_admin_hello_response(user)
