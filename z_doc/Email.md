# Emails

## Local (Cmde: ./start)

✅ Installation MailHog (Stocké dans z_doc/) sur ta machine locale (outil SMTP pour dev, interface web pour visualiser les mails sur [http://localhost:1080](http://localhost:1080)) (Par défaut, c'est la port 8025...)

✅ Configuration du backend (FastAPI/Django) pour utiliser MailHog comme serveur SMTP (host: localhost, port: 1025).

- L'interface web MailHog est accessible sur sur [http://localhost:1080](http://localhost:1080)

- Les variables SMTP sont dans backend/app/config.py et .env :

```bash
  * SMTP_HOST=localhost
  * SMTP_PORT=1025
  * EMAIL_FROM=noreply@local.test
```

- Pas besoin d'identifiants ni de TLS en local avec MailHog.

✅ Créer une fonction d’envoi d’email simple (ex : confirmation, notification).

- Voir backend/app/services/email_service.py : fonction send_email(to, subject, body, html=None)

✅ Tester l’envoi d’un email depuis le backend et vérifier la réception dans l’interface MailHog

- Lancer MailHog (z_doc/MailHog_windows_amd64.exe)
  - L'interface web sera sur [http://localhost:1080](http://localhost:1080)
- Lancer le backend FastAPI
- Envoyer une requête POST sur

```bash
/api/test-email?to=ton@email.test
```

→ À noter: Il n'y a pas de JWT pour ce test en local

- Exemple PowerShell :

```bash
Invoke-WebRequest -Uri "http://localhost:8000/api/test-email?to=test@local.test" -Method POST
```

## Docker (Cmde: ./docker)

✅ Un service Maildev est inclus dans docker-compose.dev.yml (SMTP pour dev, interface web pour visualiser les mails sur [http://localhost:1080](http://localhost:1080)).

- Les variables SMTP sont dans backend/.env et .env.example :

```bash
  * SMTP_HOST=maildev
  * SMTP_PORT=1025
  * EMAIL_FROM=noreply@local.test
  - L'interface web Maildev est accessible sur http://localhost:1080
```

- Pas besoin d'identifiants ni de TLS avec Maildev.

- Lancer l'environnement Docker dev :

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

- Envoyer une requête POST sur :

```bash
/api/test-email?to=ton@email.test
```

- Exemple PowerShell :

```bash
Invoke-WebRequest -Uri "http://localhost:8000/api/test-email?to=test@local.test" -Method POST
```

✅ Résumé

En dev, l’endpoint /api/test-email est public (pas besoin de token).
En prod, il est protégé par authentification admin/system.

Visualisation des emails (MailHog et/ou Maildev)

[http://localhost:1080](http://localhost:1080)
