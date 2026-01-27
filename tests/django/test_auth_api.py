import json
from datetime import datetime, timedelta, timezone

import jwt
import pytest
from django.conf import settings
from django.contrib.auth import get_user_model


@pytest.mark.django_db()
def test_login_ok(client):
    User = get_user_model()
    user = User.objects.create_user(username="alice", password="secret")

    response = client.post(
        "/auth/login/",
        data=json.dumps({"username": user.username, "password": "secret"}),
        content_type="application/json",
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["token_type"] == "bearer"
    assert "access_token" in payload
    assert "refresh_token" in payload


@pytest.mark.django_db()
def test_login_missing_credentials(client):
    response = client.post(
        "/auth/login/",
        data=json.dumps({"username": "alice"}),
        content_type="application/json",
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Missing credentials"


@pytest.mark.django_db()
def test_login_invalid_json(client):
    response = client.post(
        "/auth/login/",
        data="{invalid-json}",
        content_type="application/json",
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid JSON"


@pytest.mark.django_db()
def test_login_method_not_allowed(client):
    response = client.get("/auth/login/")

    assert response.status_code == 405
    assert response.json()["detail"] == "Method not allowed"


@pytest.mark.django_db()
def test_refresh_ok(client):
    User = get_user_model()
    user = User.objects.create_user(username="bob", password="secret")

    now = datetime.now(tz=timezone.utc)
    refresh_payload = {
        "user_id": user.id,
        "username": user.get_username(),
        "type": "refresh",
        "iat": now,
        "exp": now + timedelta(days=1),
        "iss": settings.JWT_ISSUER,
        "roles": [],
        "permissions": [],
        "is_staff": False,
        "is_superuser": False,
    }
    refresh_token = jwt.encode(
        refresh_payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
    )

    response = client.post(
        "/auth/refresh/",
        data=json.dumps({"refresh_token": refresh_token}),
        content_type="application/json",
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["token_type"] == "bearer"
    assert "access_token" in payload
    assert "refresh_token" in payload


@pytest.mark.django_db()
def test_refresh_invalid_token_type(client):
    User = get_user_model()
    user = User.objects.create_user(username="charlie", password="secret")

    now = datetime.now(tz=timezone.utc)
    access_payload = {
        "user_id": user.id,
        "username": user.get_username(),
        "type": "access",
        "iat": now,
        "exp": now + timedelta(minutes=5),
        "iss": settings.JWT_ISSUER,
        "roles": [],
        "permissions": [],
        "is_staff": False,
        "is_superuser": False,
    }
    access_token = jwt.encode(
        access_payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
    )

    response = client.post(
        "/auth/refresh/",
        data=json.dumps({"refresh_token": access_token}),
        content_type="application/json",
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid token type"
