from typing import List, Optional

from pydantic import BaseModel


class HelloResponse(BaseModel):
    message: str
    environment: str
    user_id: Optional[int] = None
    username: Optional[str] = None


class AdminHelloResponse(HelloResponse):
    admin_note: Optional[str] = None
    roles: Optional[List[str]] = None


class HealthResponse(BaseModel):
    status: str
    environment: str
    server_id: str
