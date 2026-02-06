@echo off

REM Démarre les services Docker (dev) avec build
pushd "%~dp0"
:: Usage: docker.bat [dev|prod|.]  ('.' or empty -> docker-compose.yml)
set "ARG=%~1"
set "SUFFIX=%ARG%"
@REM if "%SUFFIX%"=="" set "SUFFIX=.dev"
if /I "%SUFFIX%"=="prod" set "SUFFIX=.prod"
if /I "%SUFFIX%"=="dev" set "SUFFIX=.dev"
if "%SUFFIX%"=="." set "SUFFIX="

@REM .exe: Appel explicite pour pas de conflit avec docker.bat
@REM call stop.bat
docker.exe compose down

echo [*] Using docker-compose%SUFFIX%.yml
docker.exe compose -f docker-compose%SUFFIX%.yml up --build -d
set EXITCODE=%ERRORLEVEL%
popd

@REM REM Démarre le serveur Maildev
@REM echo [*] Démarrage du serveur Maildev (port 1080/1025)...
@REM docker.exe compose -f docker-compose%SUFFIX%.yml up -d maildev
@REM set EXITCODE_MAILDEV=%ERRORLEVEL%

REM Démarre aussi Cryptogeeks (CGC) en local
@REM pushd "%~dp0deploy\cryptogeeks"
@REM docker.exe compose -f docker-compose%SUFFIX%.yml up --build -d
@REM set EXITCODE2=%ERRORLEVEL%
@REM popd

REM Combine les codes de sortie (si l'un échoue, EXITCODE sera non nul)
if %EXITCODE% NEQ 0 exit /b %EXITCODE%
if %EXITCODE2% NEQ 0 exit /b %EXITCODE2%
exit /b 0
