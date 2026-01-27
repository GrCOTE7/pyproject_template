from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict

import jwt
import pytest
from fastapi.testclient import TestClient

from backend.app.config import settings
from backend.app.main import app


def _build_access_token(payload_overrides: Dict[str, Any] | None = None) -> str:
    now = datetime.now(tz=timezone.utc)
    payload: Dict[str, Any] = {
        "sub": "test-user",
        "type": "access",
        "iss": settings.JWT_ISSUER,
        "iat": now,
        "exp": now + timedelta(minutes=5),
        "user_id": 1,
        "username": "alice",
        "roles": ["user"],
        "permissions": [],
        "is_superuser": False,
    }
    if payload_overrides:
        payload.update(payload_overrides)
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


@pytest.fixture()
def fastapi_client() -> TestClient:
    return TestClient(app)


@pytest.fixture()
def user_token() -> str:
    return _build_access_token()


@pytest.fixture()
def admin_token() -> str:
    return _build_access_token({"roles": ["admin"]})
