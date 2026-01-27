# 🎯 Tests Automatisés - Guide Rapide

## Ce qui a été implémenté

✅ **Health Checks automatiques**

- Vérifie que les 3 serveurs répondent (FastAPI, Django, React)
- S'exécute automatiquement après `./start.bat`
- BIG message d'alerte si un service est down

✅ **Tests de Hot-Reload**

- Vérifie que les modifications de code sont détectées
- Teste les 3 serveurs (FastAPI, Django, React/Vite)

✅ **Scripts dédiés**

- `test-health.bat` - Health checks uniquement
- `test-hotreload.bat` - Tests de hot-reload

## Usage rapide

### Démarrage normal (avec tests automatiques)

```bash
./start.bat
```

→ Démarre les 3 serveurs + exécute les health checks automatiquement

### Tests manuels

```bash
# Health checks seulement
./test-health.bat

# Tests de hot-reload
./test-hotreload.bat
```

## Structure des fichiers

```
    pyproject_template/
├── start.bat                    # Démarrage avec tests auto
├── test-health.bat              # Health checks seuls
├── test-hotreload.bat           # Tests hot-reload seuls
└── tests/
    ├── README.md                # Documentation complète
    ├── test_health.py           # Script health checks
    └── test_hotreload.py        # Script hot-reload
```

## Exemple de sortie

### ✅ Tous les services OK

```
============================================================
🏥 Health Checks - Pyproject Template
============================================================

✅ FastAPI: OK (200) - 15ms
✅ Django: OK (200) - 23ms
✅ React: OK (200) - 8ms

============================================================
✅ ALL SERVICES OPERATIONAL ✅
============================================================
```

### ❌ Service down

```
============================================================
🏥 Health Checks - Pyproject Template
============================================================

✅ FastAPI: OK (200) - 15ms
❌ Django: CONNECTION REFUSED (service not running?)
✅ React: OK (200) - 8ms

============================================================
❌ SOME SERVICES ARE DOWN ❌

💡 Tip: Run './start.bat' to start all services
============================================================
```

## Ce que ça résout

### Avant

❌ Vérifier manuellement les 3 serveurs à chaque changement

- Ouvrir http://localhost:8000/docs
- Ouvrir http://localhost:8001/admin
- Ouvrir http://localhost:5173
- Vérifier que le hot-reload fonctionne
- **Temps perdu : 1-2 minutes à chaque fois**

### Maintenant

✅ Tests automatiques en 2-3 secondes

- `./start.bat` lance tout et vérifie automatiquement
- Message clair si problème
- **Temps gagné : 90%**

## Intégration future

Ces tests peuvent être intégrés dans :

- ✅ Scripts de démarrage (déjà fait)
- 🔄 CI/CD (GitHub Actions)
- 🔄 Pre-commit hooks
- 🔄 Scripts de déploiement

## Dépendances

```bash
pip install requests
```

(Déjà installé dans `.venv` après `./setup.bat`)

## En cas de problème

1. Vérifier que les services sont démarrés
2. Vérifier les fenêtres réduites dans la barre des tâches
3. Exécuter `./test-health.bat` pour diagnostiquer
4. Consulter [tests/README.md](tests/README.md) pour plus de détails
