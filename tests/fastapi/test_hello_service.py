from backend.app.services.hello_service import (
    build_admin_hello_response,
    build_hello_response,
)


def test_build_hello_response():
    user = {"user_id": 42, "username": "bob"}
    result = build_hello_response(user)

    assert result["message"] == "Hello from FastAPI!"
    assert result["user_id"] == 42
    assert result["username"] == "bob"


def test_build_admin_hello_response():
    user = {"user_id": 7, "username": "root", "roles": ["admin"]}
    result = build_admin_hello_response(user)

    assert result["message"] == "Hello from FastAPI!"
    assert result["admin_note"] == "(For admins only)"
    assert result["roles"] == ["admin"]
