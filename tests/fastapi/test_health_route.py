def test_health_route_ok(fastapi_client):
    response = fastapi_client.get("/api/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "environment" in data
    assert "server_id" in data
