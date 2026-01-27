# Déploiement VPS (stack prod)

Ce projet est prêt pour un déploiement VPS via Docker (mode prod). La stack déployée expose **uniquement** le frontend (Nginx) en HTTP. Les backends sont accessibles en interne via le réseau Docker.

## 1) Pré‑requis VPS

- Docker Engine installé
- Docker Compose v2 installé
- Ports ouverts : **80** (HTTP) et **443** (HTTPS si TLS)

## 2) Récupérer le projet

```bash
git clone <votre-repo>
cd pyproject_template
```

## 3) Préparer les variables d’environnement

Créez les fichiers `.env` suivants sur le VPS :

- **Racine** : `.env` (frontend)
- **FastAPI** : `backend/.env`
- **Django** : `backend/django/.env`

Exemple minimal recommandé :

**.env (racine)**

```
ENV=prod
VITE_AUTH_BASE_URL=https://votre-domaine.com
```

**backend/.env**
```
ENV=prod
FASTAPI_PORT=8000
FASTAPI_CORS_ORIGINS=https://votre-domaine.com
```

**backend/django/.env**
```
ENV=prod
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=votre-domaine.com
DJANGO_SECRET_KEY=changez-moi-avec-une-cle-secrete
DJANGO_CORS_ORIGINS=https://votre-domaine.com
```

> Ajustez selon vos besoins métiers (DB, Redis, etc.).

## 4) Lancer la stack prod

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Accès :
- Frontend : `http://votre-domaine.com`
- FastAPI (via Nginx interne) : `/api/…`
- Django (via Nginx interne) : `/auth/…`

## 5) Activer HTTPS (recommandé)

Le plus simple sur VPS est d’utiliser un proxy TLS sur l’hôte (Caddy ou Nginx) :

- **Caddy** (exemple) :
  - Caddyfile :
    ```
    votre-domaine.com {
        reverse_proxy localhost:80
    }
    ```
  - Caddy gère automatiquement les certificats TLS.

## 6) Vérifications utiles

```bash
# Logs frontend (nginx)
docker logs -f react_frontend

# Logs FastAPI
docker logs -f fastapi_backend

# Logs Django
docker logs -f django_backend
```

---

Si vous voulez, je peux aussi ajouter la base de données (PostgreSQL) et Redis dans la stack prod.
