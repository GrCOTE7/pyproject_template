import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("config")

# Charge la config depuis Django settings avec le namespace CELERY_
app.config_from_object("django.conf:settings", namespace="CELERY")

# Découvre automatiquement les tasks des apps Django
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print(f"Celery debug task: {self.request!r}")
