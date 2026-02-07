import django, os, sys

# Exécution : docker exec -it celery_worker python scripts/test.py

# Ajouter la racine Django au PYTHONPATH
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# Indiquer les settings Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

django.setup()
print(django.conf.settings.INSTALLED_APPS)

# ----
# Ou, directement inline :
# docker exec -it celery_worker python -c "import django; django.setup(); print(django.conf.settings.INSTALLED_APPS)"
# ----
# Ou, en shell dans le contnr :
# docker exec -it celery_worker sh
# python
# import django
# django.setup()
# print(django.conf.settings.INSTALLED_APPS)
