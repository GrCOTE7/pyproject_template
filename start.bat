@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ===================================================
echo   Pyproject Template - Démarrage Local (Windows)
echo ===================================================

echo.
echo [0/4] Vérification de l'environnement...
if not exist "%~dp0.venv\Scripts\python.exe" (
    echo.
    echo [ERREUR] Environnement virtuel introuvable.
    echo Lancez d'abord setup.bat pour l'installer.
    exit /b 1
)

"%~dp0.venv\Scripts\python.exe" -c "import jwt" >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERREUR] Dépendances manquantes - PyJWT.
    echo Lancez setup.bat pour installer les requirements.
    exit /b 1
)

"%~dp0.venv\Scripts\python.exe" -c "import slowapi" >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERREUR] Dépendances manquantes - SlowAPI.
    echo Lancez setup.bat pour installer les requirements.
    exit /b 1
)

echo.
echo [1/4] Nettoyage des services existants...
call stop.bat

:: Vérification des ports
"%~dp0.venv\Scripts\python.exe" "%~dp0tests\check_ports.py"
if errorlevel 1 goto ports_in_use
goto ports_free

:ports_in_use
echo.
echo ===================================================
echo.
echo   ⚠️  ATTENTION : Des services semblent déjà actifs
echo.
echo   Arrêt automatique des services existants puis redémarrage.
echo.
echo ===================================================
echo.
echo [*] Arrêt des services existants...
call stop.bat
timeout /t 2 /nobreak >nul
goto start_services

:ports_free
call .venv\Scripts\activate
goto start_services

:start_services

echo.
@REM Pour tester la résilience de l'app face aux erreurs SMTP
@REM echo [MailHog] Lancement de MailHog (Sous Win, UI obligatoirement / port 8025)...
@REM start "MailHog" /min cmd /c "cd z_doc & MailHog_windows_amd64.exe

echo [MailPit] Lancement de MailPit (Port 8025)...
start "MailPit" /min cmd /c "cd z_doc & MailPit.exe



echo.
echo [2/4] Lancement du Backend (FastAPI)...
:: /min lance la fenetre reduite dans la barre des taches
echo.
start "Backend - FastAPI" /min cmd /c "call .venv\Scripts\activate & cd backend & uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo [3/4] Lancement du Backend (Django)...
:: /min lance la fenetre reduite dans la barre des taches
start "Backend - Django" /min cmd /c "call .venv\Scripts\activate & cd backend\django & python manage.py runserver 0.0.0.0:8001"

echo.
echo [4/4] Lancement du Frontend (Vite)...
:: /min lance la fenetre reduite dans la barre des taches
start "Frontend - Vite" /min cmd /c "cd frontend & npm run dev"

REM Démarre aussi Cryptogeeks (CGC) en local
echo.
@REM echo [4b/4] Lancement de Cryptogeeks (Vite, port 5174)...
:: /min lance la fenetre reduite dans la barre des taches
start "Cryptogeeks - Vite" /min cmd /c "cd deploy\cryptogeeks\frontend & npm run dev -- --port 5174"

echo.
    echo ================================================
    echo   Services lancés en ARRIÈRE-PLAN (réduits).
    echo   - Serveur email: http://localhost:1025
    echo   - Backend FastAPI: http://localhost:8000/api/health
    echo   - Backend Django: http://localhost:8001/admin/
    echo   - Frontend PPT: http://localhost:5173
    echo   - (Option) Frontend CGC: http://localhost:5174
    echo   - Frontend UI Mail: http://localhost:8025
    echo ================================================

echo.
echo [5/5] Attente initiale (7s), puis 5 tentatives chaque seconde...
set /a INITIAL_DELAY=7
set /a RETRY_MAX=5
set /a RETRY_DELAY=1
set /a RETRIES=0

timeout /t %INITIAL_DELAY% /nobreak >nul

:wait_services
call .venv\Scripts\activate >nul 2>&1
python tests\test_health.py >nul 2>&1
if errorlevel 1 (
    set /a RETRIES+=1
    if %RETRIES% GTR %RETRY_MAX% goto wait_timeout
    timeout /t %RETRY_DELAY% /nobreak >nul
    goto wait_services
)

echo.
echo [*] Services prets. Execution des Health Checks...
call .venv\Scripts\activate
python tests\test_health.py
goto health_done

:wait_timeout
echo.
echo [*] Services non prets apres %RETRY_MAX% tentatives. Execution des Health Checks...
call .venv\Scripts\activate
python tests\test_health.py

:health_done

if errorlevel 1 (
    echo.
    echo ===================================================
    echo.
    echo   *** ❌ ALERTE: CERTAINS SERVICES NE RÉPONDENT PAS ***
    echo.
    echo     Vérifiez les fenêtres réduites dans la barre
    echo     des tâches pour voir les erreurs éventuelles.
    echo.
    echo ===================================================
    timeout /t 10 /nobreak >nul
) else (
    echo.
    echo ============================================================
    echo [INFO] Compte admin déjà existant ou erreur
    echo   ✅ Tous les SERVICES sont OPÉRATIONNELS!
    echo   NOTE: Les fenêtres sont réduites dans la barre des tâches.
    echo         Fermez-les manuellement pour arrêter les serveurs.
    echo ============================================================
)
@REM pause
