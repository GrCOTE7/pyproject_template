import json
from datetime import datetime, timedelta, timezone

import jwt
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def _get_user_roles(user):
    return list(user.groups.values_list("name", flat=True))


def _get_user_permissions(user):
    return list(user.get_all_permissions())


def _build_tokens(user):
    now = datetime.now(timezone.utc)
    access_exp = now + timedelta(minutes=settings.JWT_ACCESS_TTL_MINUTES)
    refresh_exp = now + timedelta(days=settings.JWT_REFRESH_TTL_DAYS)

    roles = _get_user_roles(user)
    permissions = _get_user_permissions(user)

    access_payload = {
        "user_id": user.id,
        "username": user.get_username(),
        "type": "access",
        "iat": now,
        "exp": access_exp,
        "iss": settings.JWT_ISSUER,
        "roles": roles,
        "permissions": permissions,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    }

    refresh_payload = {
        "user_id": user.id,
        "username": user.get_username(),
        "type": "refresh",
        "iat": now,
        "exp": refresh_exp,
        "iss": settings.JWT_ISSUER,
        "roles": roles,
        "permissions": permissions,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    }

    access_token = jwt.encode(
        access_payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
    )
    refresh_token = jwt.encode(
        refresh_payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": int(settings.JWT_ACCESS_TTL_MINUTES) * 60,
    }


@csrf_exempt
def login(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse({"detail": "Missing credentials"}, status=400)

    user = authenticate(request, username=username, password=password)
    if not user:
        return JsonResponse({"detail": "Invalid credentials"}, status=401)

    return JsonResponse(_build_tokens(user))


@csrf_exempt
def refresh(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    token = data.get("refresh_token")
    if not token:
        return JsonResponse({"detail": "Missing refresh token"}, status=400)

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            issuer=settings.JWT_ISSUER,
        )
    except jwt.ExpiredSignatureError:
        return JsonResponse({"detail": "Refresh token expired"}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({"detail": "Invalid refresh token"}, status=401)

    if payload.get("type") != "refresh":
        return JsonResponse({"detail": "Invalid token type"}, status=401)

    User = get_user_model()
    try:
        user = User.objects.get(id=payload.get("user_id"))
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=401)

    return JsonResponse(_build_tokens(user))
