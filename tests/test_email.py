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

import smtplib
from email.mime.text import MIMEText

# Configuration MailHog
smtp_server = "localhost"
smtp_port = 1025

sender = "test@example.com"
receiver = "destinataire@example.com"

# Message
msg = MIMEText("Ceci est un email de test envoyé via MailHog.")
msg["Subject"] = "Test MailHog - Directement depuis un script Python"
msg["From"] = sender
msg["To"] = receiver

# Envoi
with smtplib.SMTP(smtp_server, smtp_port) as server:
    server.send_message(msg)

print("Email envoyé (vérifie MailHog) !")
