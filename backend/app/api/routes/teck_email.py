from fastapi import APIRouter
from ...config import settings
from ...services.email_service import send_email

router = APIRouter()


@router.get("/teck-email")
def run_teck_email():
    try:
        # Endpoint simple pour la page Teck: pas de param requis côté frontend.
        to = settings.EMAIL_FROM or "test@local.test"
        send_email(
            to=to,
            subject="Email de test via endpoint Teck",
            body="Ceci est un email de test envoyé depuis /api/teck-email.",
        )

        return {
            "status": "ok",
            "output": f"Email de test envoyé à {to} via SMTP {settings.SMTP_HOST}:{settings.SMTP_PORT}",
        }
    except Exception as e:
        return {"status": "error", "output": str(e)}
