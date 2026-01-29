from ..config import settings

MSG = "123Hello from FastAPI!"


def build_hello_response(user: dict) -> dict:

    print("User in hello_service:", user.get("username"))

    return {
        "message": MSG,
        "environment": settings.ENV,
        "user_id": user.get("user_id"),
        "username": user.get("username"),
    }


def build_admin_hello_response(user: dict) -> dict:
    return {
        "message": MSG,
        "admin_note": "(For admins only)",
        "environment": settings.ENV,
        "user_id": user.get("user_id"),
        "username": user.get("username"),
        "roles": user.get("roles"),
    }
