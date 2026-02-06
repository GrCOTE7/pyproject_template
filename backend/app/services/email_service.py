import smtplib
from email.message import EmailMessage
from ..config import settings
from ..core.logging import configure_logging

logger = configure_logging()


def send_email(to: str, subject: str, body: str, html: str = None):
    msg = EmailMessage()
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)
    if html:
        msg.add_alternative(html, subtype="html")

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as smtp:
            if settings.SMTP_TLS:
                smtp.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            smtp.send_message(msg)
        logger.info(f"Email envoyé à {to} (sujet: {subject})")
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de l'email à {to}: {e}")
        # Optionnel : lever une exception personnalisée ou retourner False
        # raise
