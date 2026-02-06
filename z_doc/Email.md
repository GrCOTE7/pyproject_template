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

## Prod

En production, n’utilise pas Mailpit (outil local) :

- configure Django pour un relais SMTP transactionnel (SendGrid/SES/Mailgun ou un SMTP interne) → **SMTP interne**,
- stocke les identifiants en variables d’environnement / Docker secrets,
- envoie les mails de façon asynchrone (Celery/worker)
- ☢️ active TLS + SPF/DKIM/DMARC pour la délivrabilité.
- Pour la France/EU, privilégie un fournisseur avec hébergement en Europe si tu as contraintes de données.

### 1 — Points de décision rapides

Envoi synchrone vs asynchrone : asynchrone (Celery/RQ) pour éviter de bloquer les requêtes HTTP.

Relais SMTP vs API provider : API (SendGrid/Mailgun/SES) offre meilleure fiabilité et métriques ; SMTP est simple mais moins riche.

Sécurité : TLS obligatoire, ne stocke jamais de mots de passe en clair dans le repo — utilise Docker secrets / vault / env vars.

Délivrabilité : configure SPF, DKIM, DMARC chez ton DNS.

### 2 — Exemples concrets (Django + Docker Compose prod)

settings.py (extrait)
python
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True") == "True"
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "no-reply@example.com")
Important : Django utilise ces paramètres pour send_mail() et EmailMessage. 

docker-compose.prod.yml (snippet)
yaml
services:
  web:
    image: yourimage
    environment:
      - EMAIL_HOST=${EMAIL_HOST}
      - EMAIL_PORT=${EMAIL_PORT}
      - EMAIL_HOST_USER_FILE=/run/secrets/email_user
      - EMAIL_HOST_PASSWORD_FILE=/run/secrets/email_pass
    secrets:
      - email_user
      - email_pass

secrets:
  email_user:
    file: ./secrets/email_user.txt
  email_pass:
    file: ./secrets/email_pass.txt
Utilise Docker secrets pour ne pas exposer les credentials. Pour exemples de stacks Django+Compose en prod, voir les samples et exemples de projets Docker/Django. 

### 3 — Robustesse et opérations

Asynchrone + retries : envoie via Celery avec retry/backoff pour erreurs transitoires.

Monitoring : logs d’envoi, métriques (taux d’échec, bounces), alerting.

Fallback : si le provider tombe, basculer vers un second provider (circuit breaker).

Test en staging : utiliser Mailpit/MailHog localement, mais jamais en prod.

### 4 — Risques et recommandations

Bloquage HTTP si envoi synchrone → utiliser worker.

Mauvaise délivrabilité sans SPF/DKIM/DMARC → configure DNS.

Fuite de credentials si stockés en clair → Docker secrets / Vault.

Limites du provider (quota, throttling) → prévoir retries et backoff. Pour une checklist de production et bonnes pratiques Docker+Django, consulte les guides de déploiement. 

### 5 — Actions immédiates recommandées

Choisir un provider (API recommandé).

Ajouter variables d’environnement / Docker secrets dans docker-compose.prod.yml.

Mettre en place Celery pour l’envoi asynchrone.

Configurer SPF/DKIM/DMARC chez ton registrar.

Tester en staging avec Mailpit localement, puis basculer en prod.

Si tu veux, je te fournis un docker-compose.prod.yml  complet, un extrait Celery + tasks pour l’envoi d’emails, et un playbook DNS pour SPF/DKIM/DMARC adapté à ton fournisseur — je te génère ça tout de suite.
