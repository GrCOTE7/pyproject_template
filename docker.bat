@echo off

call stop.bat


REM Démarre les services Docker (dev) avec build
pushd "%~dp0"
@REM .exe: Appel explicite pour pas de conflit avec docker.bat
docker.exe compose -f docker-compose.dev.yml up --build -d
set EXITCODE=%ERRORLEVEL%
popd

REM Démarre le serveur Maildev
echo [*] Démarrage du serveur Maildev (port 1080/1025)...
docker.exe compose -f docker-compose.dev.yml up -d maildev
set EXITCODE_MAILDEV=%ERRORLEVEL%

REM Démarre aussi Cryptogeeks (CGC) en local
pushd "%~dp0deploy\cryptogeeks"
docker.exe compose -f docker-compose.dev.yml up --build -d
set EXITCODE2=%ERRORLEVEL%
popd

REM Combine les codes de sortie (si l'un échoue, EXITCODE sera non nul)
if %EXITCODE% NEQ 0 exit /b %EXITCODE%
if %EXITCODE2% NEQ 0 exit /b %EXITCODE2%
exit /b 0
