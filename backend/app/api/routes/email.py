from fastapi import APIRouter, status, Depends
from ...services.email_service import send_email
from ...config import settings
from ...core.dependencies import get_current_admin

router = APIRouter()


@router.post("/test-email", status_code=status.HTTP_202_ACCEPTED)
def test_email(
    to: str,
    subject=None,
    user=Depends(get_current_admin) if settings.is_prod else None,
):
    defaultSubject = "Email de test via FastAPI"

    """Envoie un email de test via MailHog. Public en dev, protégé en prod."""
    send_email(
        to=to,
        subject=defaultSubject + " " + (subject or ""),
        body="Ceci est un email de test envoyé via FastAPI via MailHog.",
    )
    return {"detail": f"Email envoyé à {to}"}
