def test_hello_requires_auth(fastapi_client):
    response = fastapi_client.get("/api/hello")

    assert response.status_code == 401
    assert response.json()["detail"] == "Missing Bearer token"


def test_hello_with_user_token(fastapi_client, user_token):
    response = fastapi_client.get(
        "/api/hello",
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Hello from FastAPI!"
    assert data["username"] == "alice"
    assert data["user_id"] == 1


def test_admin_hello_forbidden_for_user(fastapi_client, user_token):
    response = fastapi_client.get(
        "/api/admin/hello",
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Insufficient role"


def test_admin_hello_for_admin(fastapi_client, admin_token):
    response = fastapi_client.get(
        "/api/admin/hello",
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Hello from FastAPI!"
    assert data["admin_note"] == "(For admins only)"
