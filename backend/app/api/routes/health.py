import asyncio
import uuid
from fastapi import APIRouter, Request, WebSocket, WebSocketDisconnect

from ...config import settings
from ...core.limiter import limiter
from ...schemas.hello import HealthResponse

router = APIRouter()

server_id = str(uuid.uuid4())
active_connections: list[WebSocket] = []


@router.get("/health", response_model=HealthResponse)
@limiter.limit(settings.RATE_LIMIT_HEALTH)
def health_check(request: Request):
    """Endpoint de santé pour monitoring."""
    return {"status": "healthy", "environment": settings.ENV, "server_id": server_id}


@router.websocket("/ws/reload")
async def websocket_reload(websocket: WebSocket):
    """WebSocket pour notifier les clients du redémarrage du serveur"""
    await websocket.accept()
    active_connections.append(websocket)
    try:
        await websocket.send_json({"type": "connected", "server_id": server_id})
        while True:
            await asyncio.sleep(5)
            await websocket.send_json({"type": "heartbeat", "server_id": server_id})
    except (WebSocketDisconnect, Exception):
        if websocket in active_connections:
            active_connections.remove(websocket)
