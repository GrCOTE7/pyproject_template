# Tests automatisés - Pyproject Template

Ce dossier contient les scripts de tests automatisés pour vérifier la santé et le bon fonctionnement du projet.

## Scripts disponibles

### 1. Health Checks (`test_health.py`)

Vérifie que les 3 serveurs répondent correctement :

- ✅ FastAPI (port 8000)
- ✅ Django (port 8001)
- ✅ React/Vite (port 5173)

**Usage :**

```bash
python tests/test_health.py
```

**Sortie :**

```bash
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

### 2. Hot-Reload Tests (`test_hotreload.py`)

Vérifie que le hot-reload fonctionne sur les 3 serveurs :

- 🔥 FastAPI (détection des changements de fichiers)
- 🔥 Django (runserver --reload)
- 🔥 React/Vite (HMR - Hot Module Replacement)

**Usage :**

```bash
python tests/test_hotreload.py
```

**Note :** Ce test modifie temporairement des fichiers pour déclencher le reload.

## Intégration dans le workflow

Les health checks sont automatiquement exécutés par [start.bat](../start.bat) :

1. Démarrage des 3 serveurs
2. Attente de 10 secondes
3. Exécution automatique des health checks
4. Message d'alerte si un service ne répond pas

## Installation des dépendances

```bash
pip install -r backend/requirements.txt
```

Dépendances requises :

- `requests` - Pour les requêtes HTTP

## Exemples d'utilisation

### Vérifier la santé avant un commit

```bash
python tests/test_health.py && git commit -m "..."
```

### Tester le hot-reload manuellement

```bash
python tests/test_hotreload.py
```

### Intégration dans CI/CD

```yaml
# .github/workflows/test.yml
- name: Run health checks
  run: python tests/test_health.py
```

## Codes de sortie

- `0` : Tous les tests sont passés
- `1` : Au moins un test a échoué

Parfait pour l'intégration dans des scripts shell ou CI/CD !
