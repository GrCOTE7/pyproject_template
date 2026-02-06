# from backend.app.services.email_service import send_email
# from backend.app.config import settings

# if __name__ == "__main__":
#     to = "test@local.test"  # Utiliser une adresse avec un point dans le domaine
#     subject = "Test email (script direct)"
#     body = "Ceci est un email de test envoyé directement depuis un script Python."
#     try:
#         send_email(to=to, subject=subject, body=body)
#         print(f"Email envoyé à {to} via {settings.SMTP_HOST}:{settings.SMTP_PORT}")
#     except Exception as e:
#         print(f"Erreur lors de l'envoi de l'email : {e}")

import os
import smtplib
from email.mime.text import MIMEText

# Lecture de la configuration depuis une variable d'environnement pour
# fonctionner à la fois sur l'hôte (localhost) et dans le réseau Docker
smtp_server = os.getenv("SMTP_HOST", "localhost")
smtp_port = int(os.getenv("SMTP_PORT", "1025"))
sender = os.getenv("TEST_EMAIL_SENDER", "test@example.com")
receiver = os.getenv("TEST_EMAIL_RECEIVER", "destinataire@example.com")

# Message
msg = MIMEText("Ceci est un email de test envoyé via le serveur SMTP configuré.")
msg["Subject"] = "Test SMTP - Directement depuis un script Python"
msg["From"] = sender
msg["To"] = receiver

# Envoi
with smtplib.SMTP(smtp_server, smtp_port) as server:
    server.send_message(msg)

print(f"Email envoyé via {smtp_server}:{smtp_port} !")
