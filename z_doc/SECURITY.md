# 🔒 Sécurité & Configuration

## ✅ Implémentations de sécurité

### 1. Variables d'environnement (.env)

**Fichiers créés :**
- `.env.example` - Template de configuration (à committer)
- `.env` - Configuration locale (jamais committer)
- `backend/.env` - Variables FastAPI
- `backend/django/.env` - Variables Django

**Configuration :**
```bash
# Copier le template
cp .env.example .env

# Éditer avec vos valeurs
nano .env
```

### 2. CORS (Cross-Origin Resource Sharing)

**FastAPI :**
- Middleware CORS configuré dans `backend/app/main.py`
- Origines autorisées via `FASTAPI_CORS_ORIGINS`
- Credentials supportés pour les cookies/auth

**Django :**
- Package `django-cors-headers` installé
- Configuration dans `backend/django/config/settings.py`
- Origines autorisées via `DJANGO_CORS_ORIGINS`

### 3. Secrets externalisés

**Django SECRET_KEY :**
- ❌ Avant : `SECRET_KEY = "dev-only-change-me"` (hard-coded)
- ✅ Après : `SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "default")`

**Génération d'une clé sécurisée :**
```python
# Python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

Ou :
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 4. Configuration par environnement

**Variables essentielles :**
- `ENV` : dev/staging/prod
- `DEBUG` : Active/désactive le mode debug
- `ALLOWED_HOSTS` : Hôtes autorisés (sécurité Django)
- `CORS_ORIGINS` : Origines autorisées pour CORS
- `LOG_LEVEL` : Niveau de logging

**Environnement de développement :**
- Docs API accessibles sur `/docs`
- DEBUG activé
- Hot-reload activé
- CORS permissif (localhost)

**Environnement de production :**
- Docs API désactivées
- DEBUG désactivé
- CORS restrictif (domaines spécifiques)
- Secrets forts requis

## 📋 Checklist de sécurité

### Avant déploiement en production

- [ ] Générer un `DJANGO_SECRET_KEY` fort (50+ caractères aléatoires)
- [ ] Configurer `DEBUG=False`
- [ ] Définir `ALLOWED_HOSTS` avec les domaines spécifiques
- [ ] Restreindre `CORS_ORIGINS` aux domaines frontend uniquement
- [ ] Vérifier que `.env` n'est PAS commité (dans `.gitignore`)
- [ ] Configurer HTTPS pour toutes les URLs
- [ ] Activer le rate limiting (à implémenter)
- [ ] Mettre en place un système de logs centralisé

## 🔧 Configuration recommandée

### Production (.env)
```bash
ENV=prod
DJANGO_SECRET_KEY=votre-cle-tres-secrete-de-50-caracteres-minimum
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=votredomaine.com,www.votredomaine.com
DJANGO_CORS_ORIGINS=https://votredomaine.com
FASTAPI_CORS_ORIGINS=https://votredomaine.com
LOG_LEVEL=WARNING
```

### Staging (.env)
```bash
ENV=staging
DJANGO_SECRET_KEY=autre-cle-secrete-differente-de-prod
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=staging.votredomaine.com
DJANGO_CORS_ORIGINS=https://staging.votredomaine.com
FASTAPI_CORS_ORIGINS=https://staging.votredomaine.com
LOG_LEVEL=INFO
```

## 🚀 Prochaines étapes (P1-P2)

### P1 - Authentification & Autorisation
- [ ] JWT tokens
- [ ] Sessions utilisateurs
- [ ] RBAC (Role-Based Access Control)
- [ ] OAuth2 (Google, GitHub)

### P1 - Rate Limiting
- [ ] Limiter les requêtes par IP
- [ ] Protection contre le brute force
- [ ] Throttling pour les APIs

### P2 - Sécurité avancée
- [ ] HTTPS forcé (HSTS)
- [ ] Content Security Policy (CSP)
- [ ] Protection XSS/CSRF renforcée
- [ ] Chiffrement des données sensibles
- [ ] Audit logging
- [ ] Scan de vulnérabilités (Dependabot, Snyk)

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Django Security](https://docs.djangoproject.com/en/stable/topics/security/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [12-Factor App](https://12factor.net/)
