import os
from django.contrib.auth import get_user_model


User = get_user_model()

admin_username = os.environ.get("DJANGO_ADMIN_USERNAME")
admin_password = os.environ.get("DJANGO_ADMIN_PASSWORD")
user_username = os.environ.get("DJANGO_USER_USERNAME")
user_password = os.environ.get("DJANGO_USER_PASSWORD")


def upsert_user(username, password, is_staff=False, is_superuser=False):
    if not username or not password:
        return
    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            "is_staff": is_staff,
            "is_superuser": is_superuser,
        },
    )
    if not created:
        user.is_staff = is_staff
        user.is_superuser = is_superuser
    user.set_password(password)
    user.save()


def run():
    upsert_user(admin_username, admin_password, is_staff=True, is_superuser=True)
    upsert_user(user_username, user_password, is_staff=False, is_superuser=False)


run()
