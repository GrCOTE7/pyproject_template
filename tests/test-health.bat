@echo off
echo ===================================================
echo   Test des Health Checks - Pyproject Template
echo ===================================================
echo.

call .venv\Scripts\activate

echo [*] Verification de la sante des services...
python tests/test_health.py

echo.
@REM pause
