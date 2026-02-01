# Emails

## Local

✅ Installer MailHog sur ta machine locale (outil SMTP pour dev, interface web pour visualiser les mails).

✅ Configurer le backend (FastAPI/Django) pour utiliser MailHog comme serveur SMTP (host: localhost, port: 1025).

✅ Adapter la configuration email dans tes settings (pas de dockérisation, juste local).

* Les variables SMTP sont dans backend/app/config.py et .env :

```bash
  * SMTP_HOST=localhost
  * SMTP_PORT=1025
  * EMAIL_FROM=noreply@local.test
```

* Pas besoin d'identifiants ni de TLS en local avec MailHog.

✅ Créer une fonction d’envoi d’email simple (ex : confirmation, notification).

* Voir backend/app/services/email_service.py : fonction send_email(to, subject, body, html=None)

✅ Tester l’envoi d’un email depuis le backend et vérifier la réception dans l’interface MailHog

* Lancer MailHog (z_doc/MailHog_windows_amd64.exe)
* Lancer le backend FastAPI
* Envoyer une requête POST sur

```bash
/api/test-email?to=ton@email.test
```

→ À noter: Il n'y a pas de JWT pour ce test en local

* Exemple PowerShell :

```bash
Invoke-WebRequest -Uri "http://localhost:8000/api/test-email?to=test@local.test" -Method POST
```

* Vérifier l’email

```bash
http://localhost:8025
```

✅ Résumé

En dev/local, l’endpoint /api/test-email est public (pas besoin de token).
En prod, il sera protégé par authentification admin.
