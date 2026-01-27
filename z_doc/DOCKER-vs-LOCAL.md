# 🐳 Docker vs Local - Configuration

## 🔄 Différences clés

### Mode Local (start.bat)
```
Navigateur → http://localhost:5173 (Frontend)
            ↓ (proxy Vite)
            → http://localhost:8000 (FastAPI)
            → http://localhost:8001 (Django)
```

**Variables d'environnement (.env) :**
```bash
VITE_BACKEND_URL=http://localhost:8000
VITE_DJANGO_URL=http://localhost:8001
```

### Mode Docker (docker-compose.dev.yml)
```
Navigateur → http://localhost:5173 (Frontend exposé)
            ↓ (proxy Vite dans conteneur)
            → http://backend:8000 (service Docker)
            → http://django:8001 (service Docker)
```

**Variables d'environnement (docker-compose.dev.yml) :**
```yaml
environment:
  - VITE_BACKEND_URL=http://backend:8000    # Nom du service Docker
  - VITE_DJANGO_URL=http://django:8001      # Nom du service Docker
```

## 🎯 Pourquoi cette différence ?

### En local
- Tous les services tournent sur `localhost`
- Pas de réseau Docker
- Communication directe via ports

### En Docker
- **Proxy Vite** tourne DANS le conteneur `react_frontend`
- Le proxy doit appeler les autres services via leur **nom Docker** : `backend`, `django`
- Les navigateurs accèdent via `localhost:5173` (port exposé)

## ⚙️ Configuration du proxy Vite

Le fichier `vite.config.js` utilise `VITE_BACKEND_URL` :

```javascript
const BACKEND_URL = process.env.VITE_BACKEND_URL || "http://localhost:8000";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: BACKEND_URL,  // http://backend:8000 en Docker
        changeOrigin: true,
      }
    }
  }
});
```

## 🔒 CORS

### Backend FastAPI (backend/.env)
```bash
# Autorise les requêtes depuis le navigateur
FASTAPI_CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

**Important :** Le CORS vérifie l'origine du **navigateur** (toujours `http://localhost:5173`), pas celle du proxy Vite.

## 🚀 Lancement

### Mode Local
```bash
./start.bat
```
- ✅ Utilise `.env` racine
- ✅ VITE_BACKEND_URL=http://localhost:8000

### Mode Docker
```bash
docker compose -f docker-compose.dev.yml up --build -d
```
- ✅ Surcharge avec environment dans docker-compose.dev.yml
- ✅ VITE_BACKEND_URL=http://backend:8000 (réseau Docker)

## 🧪 Tests

### Vérifier que tout fonctionne en Docker

```powershell
# Tester FastAPI
Invoke-RestMethod -Uri "http://localhost:8000/api/hello"

# Vérifier les variables du frontend
docker exec react_frontend printenv | Select-String "VITE"

# Voir les logs
docker logs react_frontend --tail 20
docker logs fastapi_backend --tail 20
```

### Accès

- Frontend : http://localhost:5173
- FastAPI : http://localhost:8000/docs
- Django : http://localhost:8001/admin

## 📝 Résumé

| Aspect                | Local                   | Docker                  |
|-----------------------|-------------------------|-------------------------|
| **Proxy Vite target** | `http://localhost:8000` | `http://backend:8000`   |
| **CORS origin**       | `http://localhost:5173` | `http://localhost:5173` |
| **Navigateur**        | `http://localhost:5173` | `http://localhost:5173` |
| **Réseau**            | localhost               | Réseau Docker (appnet)  |

**Clé :** Le proxy Vite utilise les noms de services Docker, mais le navigateur accède toujours via `localhost`.
