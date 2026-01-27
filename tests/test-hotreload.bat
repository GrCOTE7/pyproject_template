@echo off
echo ===================================================
echo   Test du Hot-Reload - Pyproject Template
echo ===================================================
echo.
echo ATTENTION: Ce test va temporairement modifier
echo            des fichiers pour verifier le hot-reload.
echo.
@REM pause

call .venv\Scripts\activate

echo [*] Execution des tests de hot-reload...
python tests/test_hotreload.py

echo.
@REM pause
