@echo off
REM Script helper pour vérifier les ports et retourner le résultat
call .venv\Scripts\activate
python tests/check_ports.py
exit /b %ERRORLEVEL%
