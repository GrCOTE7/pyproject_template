import jwt
from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse

from ..config import settings


async def jwt_middleware(request: Request, call_next):

    path = request.url.path

    # En dev/local, ne pas protéger l'endpoint de test email
    from ..config import settings

    if settings.is_dev and path.startswith("/api/test-email"):
        return await call_next(request)

    if not path.startswith("/api") or path.startswith("/api/health"):
        return await call_next(request)
    if path.startswith("/api/v1/health"):
        return await call_next(request)

    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return JSONResponse({"detail": "Missing Bearer token"}, status_code=401)

    token = auth_header.replace("Bearer ", "", 1).strip()
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            issuer=settings.JWT_ISSUER,
        )
    except jwt.ExpiredSignatureError:
        return JSONResponse({"detail": "Token expired"}, status_code=401)
    except jwt.InvalidTokenError:
        return JSONResponse({"detail": "Invalid token"}, status_code=401)

    if payload.get("type") != "access":
        return JSONResponse({"detail": "Invalid token type"}, status_code=401)

    request.state.user = payload
    return await call_next(request)


def require_roles(*required_roles: str):
    def _check(request: Request):
        user = getattr(request.state, "user", {})
        roles = set(user.get("roles") or [])
        if user.get("is_superuser"):
            return
        if not roles.intersection(required_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient role",
            )

    return _check


def require_permissions(*required_permissions: str):
    def _check(request: Request):
        user = getattr(request.state, "user", {})
        permissions = set(user.get("permissions") or [])
        if user.get("is_superuser"):
            return
        if not permissions.issuperset(required_permissions):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )

    return _check
