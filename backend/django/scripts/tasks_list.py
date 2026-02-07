import os
import sys
import django
from celery import Celery

# Exécution : docker exec -it celery_worker python scripts/tasks_list.py
# ou F9

# 1) Ajouter la racine Django au PYTHONPATH
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# 2) Indiquer les settings Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# 3) Initialiser Django
django.setup()

# 4) Charger Celery
app = Celery("config")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


def list_tasks():
    print("=== Liste des tâches Celery ===")
    for name in sorted(app.tasks.keys()):
        print(name)


if __name__ == "__main__":
    list_tasks()
