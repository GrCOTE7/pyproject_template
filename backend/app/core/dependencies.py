from fastapi import HTTPException, Request, status


def get_current_user(request: Request) -> dict:
    user = getattr(request.state, "user", None)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )
    return user


def get_current_roles(request: Request) -> list[str]:
    user = get_current_user(request)
    return list(user.get("roles") or [])


def get_current_admin(request: Request) -> dict:
    user = get_current_user(request)
    roles = set(user.get("roles") or [])
    if user.get("is_superuser") or "admin" in roles:
        return user
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Insufficient role",
    )
