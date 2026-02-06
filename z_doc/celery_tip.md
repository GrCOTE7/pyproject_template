# Celery — Commandes rapides et conseils (Docker)

Résumé concis pour démarrer, tester et dépanner Celery (worker + beat) avec Docker Compose.

1) Démarrer les services (Redis + worker + beat)

```powershell
docker compose -f docker-compose.yml up -d redis celery celery_beat
```

2) Vérifier que les conteneurs sont up

```powershell
docker ps --filter "name=celery_worker"
docker ps --filter "name=celery_beat"
docker ps --filter "name=redis"
```

3) Suivre les logs du worker (diagnostic)

```powershell
docker logs -f celery_worker
```

Regarder les lignes d'initialisation : connexion au broker Redis, autodiscovery des tasks, erreurs d'import.

4) Pinger le worker depuis l'hôte (inspect)

```powershell
docker exec celery_worker celery -A config inspect ping
```

Réponse attendue : quelque chose comme `{ "celery@...": {"ok": "pong"} }`.

5) Tester une task simple

- Créer `yourapp/tasks.py` :

```python
from celery import shared_task

@shared_task
def add(x, y):
    return x + y
```

- Appeler depuis le conteneur Django :

```powershell
docker exec -it django_backend python manage.py shell -c "from yourapp.tasks import add; print(add.delay(2,3).id)"
```

- Vérifier dans les logs du worker que la tâche a été reçue et exécutée.

6) Vérifier le résultat (si backend de résultats activé, ex: Redis)

```powershell
# task_id obtenu depuis add.delay(...)
docker exec redis redis-cli GET "celery-task-meta-<task_id>"
```

7) Fichiers/boilerplate utiles

- `backend/django/config/celery.py` (exemple minimal) :

```python
import os
from celery import Celery
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
app = Celery("config")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
```

- `backend/django/config/__init__.py` :

```python
from .celery import app as celery_app
__all__ = ("celery_app",)
```

8) Erreurs courantes

- `exec: "celery": executable file not found` → Celery non installé dans l'image : ajouter `celery` (et `redis`) dans `requirements.txt` puis rebuild l'image.
- `No nodes replied within time constraint` → worker pas encore prêt ou problème de connexion au broker (vérifier URL `CELERY_BROKER_URL`, réseau Docker, logs Redis).
- `ImportError` sur les tasks → vérifier `PYTHONPATH`, `DJANGO_SETTINGS_MODULE` et que l'app est incluse dans `INSTALLED_APPS`.

9) Rebuild / relance (après modifications)

```powershell
docker compose -f docker-compose.yml build django celery celery_beat
docker compose -f docker-compose.yml up -d redis celery celery_beat
```

10) Conseils production

- Utiliser un broker robuste (Redis ou RabbitMQ), monitoring (Flower, Prometheus), et un backend de résultats si nécessaire.
- Configurer retries, backoff et idempotence pour les tasks d'envoi d'email.
- Exécuter workers en plusieurs réplicas si charge importante.
- Utiliser variables d'environnement / Docker secrets pour les credentials.

❌ Si vous voulez, j'ajoute un exemple `tasks.py` plus complet (retry, logging) et un `docker-compose.prod.yml` exemple avec `celery` + `redis` pour la prod.
