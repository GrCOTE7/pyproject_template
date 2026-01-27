@echo off

call stop.bat

REM Démarre les services Docker (dev) avec build
pushd "%~dp0"
@REM .exe: Appel explicite pour pas de conflit avec docker.bat
docker.exe compose -f docker-compose.dev.yml up --build -d
set EXITCODE=%ERRORLEVEL%
popd
exit /b %EXITCODE%
