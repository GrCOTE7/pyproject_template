# Celery — Commandes rapides et conseils (Docker)

Résumé concis pour démarrer, tester et dépanner Celery (worker + beat) avec Docker Compose.

Important : le compose monte désormais le dossier projet `./tests` dans `/app/tests` des conteneurs `django`, `celery` et `celery_beat`. Les commandes ci‑dessous supposent que vos scripts de test sont accessibles depuis `/app/tests`.

1) Démarrer les services nécessaires (Redis + Django + worker + beat)

```powershell
docker compose up -d --build redis django celery celery_beat
```

2) Vérifier que les conteneurs sont up

```powershell
docker ps --filter "name=celery_worker"
docker ps --filter "name=celery_beat"
docker ps --filter "name=redis"
docker ps --filter "name=django_backend"
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

- Exemple `backend/django/apps/auth_api/tasks.py` :

```python
from celery import shared_task

@shared_task
def add(x, y):
        return x + y
```

- Appeler depuis le conteneur Django (pour déclencher la tâche) :

```powershell
docker exec -it django_backend python manage.py shell -c "from apps.auth_api.tasks import add; print(add.delay(2,3).id)"
```

- Vérifier dans les logs du worker que la tâche a été reçue et exécutée.

6) Exécuter le test de vérification des tâches

Le dépôt contient un script simple `tests/test_celery_task.py` qui lance `add.delay(2,3)` et attend la réponse. Grâce au montage `./tests:/app/tests`, vous pouvez l'exécuter directement dans le conteneur :

```powershell
# lancer le script Python (standalone) :
docker exec -e PYTHONPATH=/app -w /app django_backend python /app/tests/test_celery_task.py

# ou lancer via pytest (attention au conftest du projet) :
docker exec -e PYTHONPATH=/app -w /app django_backend pytest -q tests/test_celery_task.py
```

Si `pytest` échoue à cause d'un `conftest.py` (import de FastAPI, etc.), exécutez d'abord le script autonome. Si le fichier de test n'existe pas dans le conteneur, vous pouvez le copier :

```powershell
docker cp tests/test_celery_task.py django_backend:/app/tests/test_celery_task.py
```

7) Changer le code des tasks — recharger le worker

- Après modification de `backend/django/apps/auth_api/tasks.py`, rebuild n'est pas toujours nécessaire si vous avez monté le code :

    - Pour images construites (code copié à build time) : rebuild puis restart :

```powershell
docker compose up -d --build django
docker restart celery_worker
```

    - Si vous montez le dossier (volume), il suffit souvent de redémarrer le worker pour qu'il recharge les modules :

```powershell
docker restart celery_worker
```

8) Vérifications liées au backend de résultats (Redis)

```powershell
# récupérer metadata si Redis est backend de résultats
docker exec redis redis-cli GET "celery-task-meta-<task_id>"
```

9) Erreurs courantes et diagnostics

- `exec: "celery": executable file not found` → Celery non installé dans l'image : ajouter `celery` dans `requirements.txt` puis rebuild l'image.
- `No nodes replied within time constraint` → worker pas encore prêt ou problème de connexion au broker (vérifier `CELERY_BROKER_URL`, réseau Docker, logs Redis).
- `ImportError` sur les tasks → vérifier `PYTHONPATH`, `DJANGO_SETTINGS_MODULE` et que l'app est incluse dans `INSTALLED_APPS`.

10) Rebuild / relance (après modifications majeures)

```powershell
docker compose build django celery celery_beat
docker compose up -d redis django celery celery_beat
```

11) Conseils production

- Utiliser un broker robuste (Redis ou RabbitMQ), monitoring (Flower, Prometheus), et un backend de résultats si nécessaire.
- Configurer retries, backoff et idempotence pour les tasks d'envoi d'email.
- Exécuter workers en plusieurs réplicas si charge importante.
- Utiliser variables d'environnement / Docker secrets pour les credentials.

Si vous voulez, j'ajoute un exemple `tasks.py` plus complet (retry, logging) et un `docker-compose.prod.yml` exemple avec `celery` + `redis` pour la prod.
