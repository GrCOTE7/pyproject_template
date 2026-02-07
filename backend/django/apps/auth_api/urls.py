from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.login, name="auth_login"),
    path("refresh/", views.refresh, name="auth_refresh"),
    path("tasks/", views.tasks_list, name="auth_tasks"),
]
