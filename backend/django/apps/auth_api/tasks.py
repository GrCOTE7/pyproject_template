from celery import shared_task


@shared_task
def add(x, y):
    return x + y


# dans backend/
# docker exec -it django_backend python manage.py shell -c "from apps.auth_api.tasks import add; r = add.delay(2,3); print(r.id)"
