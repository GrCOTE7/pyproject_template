# CI/CD

Ce projet utilise GitHub Actions pour automatiser les tests, la construction et (optionnellement) le déploiement.

## Workflows

- CI : [.github/workflows/ci.yml](.github/workflows/ci.yml)
  - Lint + tests + build frontend
  - Tests backend (FastAPI + Django)
- CD : [.github/workflows/cd.yml](.github/workflows/cd.yml)
  - Build + push des images Docker sur GHCR
  - Déploiement VPS optionnel via SSH

## Déclencheurs

### CI
- À chaque push sur main
- À chaque pull request

### CD
- À chaque push sur main
- À chaque tag v*

## Registre d’images (GHCR)

Images publiées (par défaut) :
- ghcr.io/grcote7/pyproject_template-backend:latest
- ghcr.io/grcote7/pyproject_template-django:latest
- ghcr.io/grcote7/pyproject_template-frontend:latest

Le nom est calculé automatiquement depuis le dépôt et forçé en minuscule.

## Déploiement VPS (optionnel)

Si vous voulez activer le déploiement automatique, ajoutez ces secrets GitHub :
- VPS_HOST : IP ou hostname du serveur
- VPS_USER : utilisateur SSH
- VPS_SSH_KEY : clé privée SSH (format OpenSSH)
- VPS_PATH : chemin du projet sur le VPS

Le job CD exécute ensuite :
- docker compose -f docker-compose.prod.yml pull
- docker compose -f docker-compose.prod.yml up -d
- docker image prune -f

## Utilisation des images dans Docker Compose

Les compose prod/VPS utilisent ces variables si besoin :
- BACKEND_IMAGE
- DJANGO_IMAGE
- FRONTEND_IMAGE

Valeurs par défaut :
- ghcr.io/grcote7/pyproject_template-backend:latest
- ghcr.io/grcote7/pyproject_template-django:latest
- ghcr.io/grcote7/pyproject_template-frontend:latest

Vous pouvez les surcharger dans le shell ou un fichier .env dédié au VPS.

## Notes

- Le build frontend s’appuie sur frontend/package-lock.json.
- Le job CI backend exécute : pytest tests/fastapi tests/django
