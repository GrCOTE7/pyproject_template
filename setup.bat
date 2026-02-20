@echo off
REM ============================================
REM Script d'installation et configuration
REM Pyproject Template - Securite et Configuration
REM ============================================

echo.
echo ========================================
echo   Pyproject Template - Setup Securité
echo ========================================
echo.

REM Verification de Python (py -0)
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Python n'est pas installe ou n'est pas dans le PATH
    pause
    exit /b 1
)

echo [OK] Python detecte
echo.

REM Installation des dependances backend FastAPI
echo ----------------------------------------
echo Installation des dependances FastAPI...
echo ----------------------------------------
if exist .venv\Scripts\python.exe (
    echo Environnement virtuel detecte - racine
    call .venv\Scripts\activate
) else (
    if exist .venv (
        echo [INFO] Environnement virtuel incomplet - suppression...
        rmdir /s /q .venv
    )
    echo Creation de l'environnement virtuel - racine...
    python -m venv .venv
    REM py -0
    REM py -3.12 venv .venv # pour installer une VEnv avec py 3.12
    if not exist .venv\Scripts\python.exe (
        echo [ERREUR] Echec de creation de l'environnement virtuel.
        pause
        exit /b 1
    )
    call .venv\Scripts\activate
)

echo Mise a jour de pip...
python -m pip install --upgrade pip

pip install -r backend\requirements.txt
if errorlevel 1 (
    echo [ERREUR] Installation FastAPI echouee
    pause
    exit /b 1
)
echo [OK] Dependances FastAPI installees
echo.

REM Installation Django (deja dans le venv racine)
echo ----------------------------------------
echo Installation des dependances Django...
echo ----------------------------------------
pip install -r backend\django\requirements.txt
if errorlevel 1 (
    echo [ERREUR] Installation Django echouee
    pause
    exit /b 1
)
echo [OK] Dependances Django installees
echo.

REM Retour a la racine
REM Installation frontend
echo ----------------------------------------
echo Installation des dependances Frontend...
echo ----------------------------------------
cd frontend
call npm install
if errorlevel 1 (
    echo [ERREUR] Installation npm echouee
    pause
    exit /b 1
)
echo [OK] Dependances Frontend installees
echo.
cd ..

REM Verification des fichiers .env
echo ----------------------------------------
echo Verification de la configuration...
echo ----------------------------------------

if not exist ".env" (
    echo [INFO] Fichier .env non trouve - Creation depuis .env.example...
    copy .env.example .env
    echo [ATTENTION] Editez le fichier .env avec vos valeurs avant de lancer l'application
)

if not exist "backend\.env" (
    echo [INFO] Fichier backend/.env non trouve - Creation...
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
    echo [INFO] Fichier backend/django/.env non trouve - Creation...
    copy backend\django\.env.example backend\django\.env 2>nul
    if errorlevel 1 (
        echo [INFO] Creation manuelle de backend/django/.env
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
echo [OK] Migrations executees
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
echo ========================================
echo   Installation terminee !
echo ========================================
echo.
echo Prochaines etapes:
echo   1. Editez .env avec vos parametres si necessaire
echo   2. Django Admin: http://localhost:8001/admin/
echo      Login: admin / Password: admin
echo   3. Consultez SECURITY.md pour la checklist de securite
echo.
echo Pour generer une cle Django secrete:
echo   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
echo.
echo ========================================
echo   Lancement de l'application...
echo ========================================
echo.
call start.bat
