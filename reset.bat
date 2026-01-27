@echo off
chcp 65001 >nul

@REM Get-ChildItem -Path . -Directory -Recurse | Where-Object { $_.Name -eq "__pycache__" } | ForEach-Object { $_.FullName; Remove-Item -Path $_.FullName -Recurse -Force }

@REM Arrête les serveurs 
@REM ❌ //2do Cf. avec docker
call stop.bat

echo Suppression des fichiers et dossiers...

@REM Efface :
@REM - .venv
@REM - .env
@REM - backend\.env
@REM - backend\app\__pycache__
@REM - backend\app\api\__pycache__
@REM - backend\app\core\__pycache__
@REM - backend\app\core\routes\__pycache__
@REM - backend\app\schemas\__pycache__
@REM - backend\app\services\__pycache__
@REM - backend\django\apps\__pycache__
@REM - backend\django\apps\auth_api\__pycache__
@REM - backend\django\config\__pycache__
@REM - backend\django\.env
@REM - backend\django\db.sqlite3
@REM - frontend\node_modules

rmdir /s /q .pytest_cache
rmdir /s /q .venv
del /f /q .env
del /f /q backend\.env

rmdir /s /q backend\app\__pycache__
rmdir /s /q backend\app\api\__pycache__
rmdir /s /q backend\app\api\routes\__pycache__
rmdir /s /q backend\app\core\__pycache__
rmdir /s /q backend\app\core\routes\__pycache__
rmdir /s /q backend\app\schemas\__pycache__
rmdir /s /q backend\app\services\__pycache__

rmdir /s /q backend\django\apps\__pycache__
rmdir /s /q backend\django\apps\auth_api\__pycache__
rmdir /s /q backend\django\config\__pycache__
del /f /q backend\django\.env
del /f /q backend\django\db.sqlite3

rmdir /s /q frontend\node_modules
del /f /q frontend\.env.local
echo Réinitialisation terminée.

echo.
@REM call setup.bat
echo.
echo Configuration réinitialisée et environnement remis à zéro.
