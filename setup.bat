@echo off
chcp 65001 > nul

REM ============================================
REM Script d'installation et configuration
REM Pyproject Template - Sécurité et Configuration
REM ============================================

echo.
echo ========================================
echo   Pyproject Template - Setup Sécurité
echo ========================================
echo.

REM Verification de Python (py -0)
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Python n'est pas installé ou n'est pas dans le PATH
    pause
    exit /b 1
)

echo [OK] Python détecté
echo.

REM Installation des dépendances backend FastAPI
echo ----------------------------------------
echo Installation des dépendances FastAPI...
echo ----------------------------------------
if exist .venv\Scripts\python.exe (
    echo Environnement virtuel détecté - racine
    call .venv\Scripts\activate
) else (
    if exist .venv (
        echo [INFO] Environnement virtuel incomplet - suppression...
        rmdir /s /q .venv
    )
    echo Création de l'environnement virtuel - racine...
    python -m venv .venv
    REM py -0
    REM py -3.12 venv .venv # pour installer une VEnv avec py 3.12
    if not exist .venv\Scripts\python.exe (
        echo [ERREUR] Echec de création de l'environnement virtuel.
        pause
        exit /b 1
    )
    call .venv\Scripts\activate
)

echo Mise a jour de pip...
@REM python -m pip install --upgrade pip
"%~dp0.venv\Scripts\python.exe" -m pip install --upgrade pip

echo Installation des dépendances FastAPI...
@REM pip install -r backend\requirements.txt
"%~dp0.venv\Scripts\python.exe" -m pip install -r backend\requirements.txt
if errorlevel 1 (
    echo [ERREUR] Installation FastAPI échouée
    pause
    exit /b 1
)
echo [OK] Dépendances FastAPI installées
echo.

REM Installation Django (deja dans le venv racine)
echo ----------------------------------------
echo Installation des dépendances Django...
echo ----------------------------------------
@REM pip install -r backend\django\requirements.txt
"%~dp0.venv\Scripts\python.exe" -m pip install -r backend\django\requirements.txt
if errorlevel 1 (
    echo [ERREUR] Installation Django échouée
    pause
    exit /b 1
)
echo [OK] Dépendances Django installées
echo.

REM Retour a la racine
REM Installation frontend
echo ----------------------------------------
echo Installation des dépendances Frontend...
echo ----------------------------------------
cd frontend
call npm install
if errorlevel 1 (
    echo [ERREUR] Installation npm échouée
    pause
    exit /b 1
)
echo [OK] Dépendances Frontend installées
echo.
cd ..

REM Verification des fichiers .env
echo ----------------------------------------
echo Verification de la configuration...
echo ----------------------------------------

if not exist ".env" (
    echo [INFO] Fichier .env non trouvé - Création depuis .env.example...
    copy .env.example .env
    echo [ATTENTION] Editez le fichier .env avec vos valeurs avant de lancer l'application
)

if not exist "backend\.env" (
    echo [INFO] Fichier backend/.env non trouvé - Création...
    copy backend\.env.example backend\.env 2>nul
    if errorlevel 1 (
        echo [INFO] Creation manuelle de backend/.env
        echo FASTAPI_HOST=0.0.0.0 > backend\.env
        echo FASTAPI_PORT=8000 >> backend\.env
        echo FASTAPI_RELOAD=True >> backend\.env
        echo FASTAPI_CORS_ORIGINS=http://localhost:5173,http://localhost:3000 >> backend\.env
        echo ENV=dev >> backend\.env
        echo LOG_LEVEL=INFO >> backend\.env
    )
)

if not exist "backend\django\.env" (
    echo [INFO] Fichier backend/django/.env non trouvé - Création...
    copy backend\django\.env.example backend\django\.env 2>nul
    if errorlevel 1 (
        echo [INFO] Création manuelle de backend/django/.env
        echo DJANGO_SECRET_KEY=dev-secret-key-change-in-production > backend\django\.env
        echo DJANGO_DEBUG=True >> backend\django\.env
        echo DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1 >> backend\django\.env
        echo DJANGO_PORT=8001 >> backend\django\.env
        echo DJANGO_CORS_ORIGINS=http://localhost:5173,http://localhost:3000 >> backend\django\.env
        echo ENV=dev >> backend\django\.env
        echo LOG_LEVEL=INFO >> backend\django\.env
    )
)

if not exist "frontend\.env.local" (
    echo [INFO] Fichier frontend/.env.local non trouve - Creation depuis frontend/.env.local_example...
    copy frontend\.env.local_example frontend\.env.local
    echo [ATTENTION] Editez frontend/.env.local avec vos valeurs E2E avant de lancer les tests
)

echo [OK] Fichiers .env configures
echo.

REM Migrations Django
echo ----------------------------------------
echo Execution des migrations Django...
echo ----------------------------------------
python backend\django\manage.py migrate
if errorlevel 1 (
    echo [AVERTISSEMENT] Migrations echouees
)
echo [OK] Migrations executées
echo.

REM Creation du superuser admin/admin pour le dev
echo ----------------------------------------
echo Creation du compte admin (dev)...
echo ----------------------------------------
python backend\django\manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@localhost', 'admin')"
if errorlevel 1 (
    echo [INFO] Compte admin deja existant ou erreur
) else (
    echo [OK] Compte admin cree - Login: admin / Password: admin
)
echo.

REM Creation du user standard user/user pour le dev
echo ----------------------------------------
echo Creation du compte user (dev)...
echo ----------------------------------------
python backend\django\manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='user').exists() or User.objects.create_user('user', 'user@localhost', 'user')"
if errorlevel 1 (
    echo [INFO] Compte user deja existant ou erreur
) else (
    echo [OK] Compte user cree - Login: user / Password: user
)
echo.

echo ========================================
echo   Installation terminée !
echo ========================================
echo.
echo Prochaines étapes:
echo   1. Éditez .env avec vos paramètres si nécessaire
echo   2. Django Admin: http://localhost:8001/admin/
echo      Login: admin / Password: admin
echo   3. Consultez SECURITY.md pour la checklist de sécurité
echo.
echo Pour générer une clé Django secrète:
echo   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
echo.
echo ========================================
echo   Lancement de l'application...
echo ========================================
echo.
call start.bat
