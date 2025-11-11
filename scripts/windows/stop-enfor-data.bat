@echo off
REM ENFOR DATA - Windows Stop Script

echo ========================================
echo    Stopping ENFOR DATA Platform
echo ========================================
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0stop-enfor-data.ps1"

echo.
pause
