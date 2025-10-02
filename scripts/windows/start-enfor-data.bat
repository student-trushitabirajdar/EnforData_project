@echo off
REM ENFOR DATA - Windows Batch Startup Script
REM This is a simple batch file that calls the PowerShell script

echo Starting ENFOR DATA Platform...
echo.

REM Check if PowerShell is available
powershell -Command "Get-Host" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PowerShell is not available
    echo Please install PowerShell or run the commands manually
    pause
    exit /b 1
)

REM Run the PowerShell script
powershell -ExecutionPolicy Bypass -File "start-enfor-data.ps1"

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to start ENFOR DATA Platform
    echo Check the error messages above
    pause
    exit /b 1
)

echo.
echo ENFOR DATA Platform started successfully!
pause