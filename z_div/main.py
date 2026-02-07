from celery import Celery

app = Celery("config")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


def list_tasks():
    print("=== Liste des tâches Celery ===")
    for name in sorted(app.tasks.keys()):
        print(name)


if __name__ == "__main__":
    list_tasks()
