FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]

# Applique les migrations et seed les utilisateurs admin/user avant de lancer le serveur
# CMD ["sh", "-c", "python manage.py migrate && python manage.py shell < scripts/seed_users.py && python manage.py runserver 0.0.0.0:8001"]
