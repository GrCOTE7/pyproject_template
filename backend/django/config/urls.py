"""URL configuration for pyproject_template core back-office."""

from django.conf import settings
from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "Pyproject Template Admin (DEV)"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("apps.auth_api.urls")),
]

if settings.DEBUG:
    urlpatterns += [path("__reload__/", include("django_browser_reload.urls"))]
