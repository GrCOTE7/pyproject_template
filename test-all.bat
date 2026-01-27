@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PYTHON=%~dp0.venv\Scripts\python.exe"

if not exist "%PYTHON%" (
    echo.
    echo [ERREUR] Environnement virtuel introuvable.
    echo Lancez setup.bat pour l'installer.
    exit /b 1
)

echo ===================================================
 echo   Pyproject Template - Tests complets
 echo ===================================================

echo.
 echo [1/4] Tests FastAPI (pytest)
"%PYTHON%" -m pytest tests/fastapi
if errorlevel 1 goto failed

echo.
 echo [2/4] Tests Django (pytest)
"%PYTHON%" -m pytest tests/django
if errorlevel 1 goto failed

echo.
 echo [3/4] Tests Frontend (Vitest)
cd /d "%~dp0frontend"
call npm test
if errorlevel 1 goto failed

cd /d "%~dp0"

echo.
 echo [4/4] Tests E2E (Playwright)
"%PYTHON%" tests\test_health.py >nul 2>&1
if errorlevel 1 (
    echo.
    echo [INFO] Services non demarres. Demarrage automatique...
    call start.bat
    timeout /t 3 /nobreak >nul
    "%PYTHON%" tests\test_health.py
    if errorlevel 1 goto failed
)

cd /d "%~dp0frontend"
call npm run test:e2e
if errorlevel 1 goto failed

cd /d "%~dp0"

echo ===================================================
echo   ✅ Tous les tests ont reussi
echo ===================================================
echo.

if exist "frontend\playwright-report\index.html" (
    cd /d "%~dp0frontend"
    @REM call npx playwright show-report
    cd /d "%~dp0"
)
exit /b 0

:failed
cd /d "%~dp0"

echo.
 echo ===================================================
 echo   ❌ Echec des tests
 echo ===================================================
exit /b 1
