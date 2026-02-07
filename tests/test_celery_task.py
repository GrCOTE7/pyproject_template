from apps.auth_api.tasks import add
from celery.result import AsyncResult

"""
Test minimal pour Celery : lance la tâche `add` et vérifie le résultat.
Exécuter dans le conteneur Django (ou depuis un env avec PYTHONPATH/DJANGO_SETTINGS_MODULE configurés).

Lancer dans POWERSHELL avec :
docker exec -e PYTHONPATH=/app -w /app django_backend python /app/tests/test_celery_task.py
"""

if __name__ == "__main__":
    r = add.delay(3, 4)
    print("task_id:", r.id)
    res = AsyncResult(r.id).get(timeout=10)
    print("result:", res)
    assert res == 7
