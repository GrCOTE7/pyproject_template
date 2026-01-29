from fastapi import APIRouter, Depends, Request
from ...core.dependencies import get_current_admin

router = APIRouter()


@router.get("/teck", tags=["teck"])
def teck_page(request: Request, admin=Depends(get_current_admin)):
    return {"message": "Bienvenue sur la page teck réservée aux admins !"}
