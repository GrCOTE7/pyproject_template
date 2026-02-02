@echo off
chcp 65001 >nul
echo ===================================================
echo   Pyproject Template - Arrêt des services
echo ===================================================
echo.

echo [*] Arrêt de FastAPI (port 8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do taskkill /F /T /PID %%a 2>nul

echo [*] Arrêt de Django (port 8001)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8001" ^| find "LISTENING"') do taskkill /F /T /PID %%a 2>nul

echo [*] Arrêt de React/Vite (port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do taskkill /F /T /PID %%a 2>nul

echo.
echo [*] Fermeture des consoles des serveurs...
taskkill /F /FI "WINDOWTITLE eq Backend - FastAPI*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Backend - Django*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Frontend - Vite*" 2>nul
echo [*] Arrêt de Cryptogeeks (port 5174)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5174" ^| find "LISTENING"') do taskkill /F /T /PID %%a 2>nul

echo [*] Arrêt de MailHog (port 8025)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8025" ^| find "LISTENING"') do taskkill /F /T /PID %%a 2>nul

taskkill /F /FI "WINDOWTITLE eq Cryptogeeks - Vite*" 2>nul
taskkill /F /FI "WINDOWTITLE eq MailHog*" 2>nul

echo.
echo ===================================================
echo   Tous les services ont été arrêtés
echo ===================================================
echo.
@REM pause

