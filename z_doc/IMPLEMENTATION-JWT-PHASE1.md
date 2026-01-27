# Implémentation Phase 1 – JWT basique

Ce document récapitule pas à pas ce qui a été mis en place pour la Phase 1 (login + refresh + validation côté FastAPI + intégration front).

---

## 1) Dépendances

- Ajout de PyJWT côté FastAPI : [backend/requirements.txt](backend/requirements.txt)
- Ajout de PyJWT côté Django : [backend/django/requirements.txt](backend/django/requirements.txt)

---

## 2) Configuration (env)

Variables JWT partagées entre Django et FastAPI (même secret, même algo, même issuer) :

- [backend/.env.example](backend/.env.example)
- [backend/django/.env.example](backend/django/.env.example)

Variables utilisées :
- JWT_SECRET
- JWT_ALGORITHM
- JWT_ISSUER
- JWT_ACCESS_TTL_MINUTES
- JWT_REFRESH_TTL_DAYS

---

## 3) Django – Endpoints d’auth

### 3.1 App Django dédiée

- App créée : [backend/django/apps/auth_api](backend/django/apps/auth_api)
- Enregistrement dans Django : [backend/django/config/settings.py](backend/django/config/settings.py)

### 3.2 Routes

Endpoints exposés via `/auth/` :
- `/auth/login/`
- `/auth/refresh/`

Voir : [backend/django/config/urls.py](backend/django/config/urls.py)

### 3.3 Logique JWT

- Génération des tokens access/refresh
- Refresh validé par token refresh + existence user

Voir : [backend/django/apps/auth_api/views.py](backend/django/apps/auth_api/views.py)

---

## 4) FastAPI – Validation JWT

Middleware JWT ajouté :
- Protège toutes les routes `/api/*` sauf `/api/health`
- Lit `Authorization: Bearer <token>`
- Vérifie signature, expiration et issuer
- Refuse si token type != access

Voir : [backend/app/main.py](backend/app/main.py)

---

## 5) Frontend – Login + stockage tokens

### 5.1 Utilitaires auth

- Stockage localStorage
- `login()` → POST `/auth/login/`
- `refreshAccessToken()` → POST `/auth/refresh/`
- `authFetch()` ajoute le Bearer et tente un refresh si nécessaire

Voir : [frontend/src/auth.js](frontend/src/auth.js)

### 5.2 UI de login

- Formulaire simple (username/password)
- Affichage des erreurs
- Logout

Voir : [frontend/src/App.jsx](frontend/src/App.jsx)

### 5.3 Appels protégés

- `/api/hello` utilise `authFetch()`
- Protection contre message vide/indéfini

Voir : [frontend/src/App.jsx](frontend/src/App.jsx) et [frontend/src/Hello.jsx](frontend/src/Hello.jsx)

---

## 6) Proxy (dev/prod)

### 6.1 Vite (dev)

- Ajout du proxy `/auth` → Django

Voir : [frontend/vite.config.js](frontend/vite.config.js)

### 6.2 Nginx (prod)

- Ajout du proxy `/auth` → Django

Voir : [frontend/nginx.conf](frontend/nginx.conf)

---

## 7) Démarrage local (Windows)

### 7.1 setup.bat

- Installe les dépendances
- Lance les migrations
- Crée l’admin dev

Voir : [setup.bat](setup.bat)

### 7.2 start.bat

- Démarrage FastAPI, Django, Frontend
- Vérifications préalables

Voir : [start.bat](start.bat)

---

## 8) Identifiants de dev

- Utilisateur : admin
- Mot de passe : admin

Créé automatiquement par setup.bat.

---

## 9) Flux d’authentification

1. Front → POST `/auth/login/` (Django)
2. Django → renvoie access + refresh
3. Front stocke tokens
4. Front → `/api/*` (FastAPI) avec Bearer
5. FastAPI vérifie le JWT

---

## 10) Prochaine étape (Phase 2)

- Ajouter `role` au user
- Mettre le rôle dans le JWT
- Vérification par rôle côté FastAPI
- UI conditionnelle côté React

