@echo off
REM ENFOR DATA - Windows Batch Startup Script
REM This script will automatically install and setup everything needed

echo ========================================
echo    ENFOR DATA Platform - Windows
echo ========================================
echo.
echo This script will:
echo  - Check for required software (Node.js, Go, PostgreSQL)
echo  - Install missing dependencies automatically
echo  - Setup the database
echo  - Start the application
echo.
echo Note: First-time setup may require administrator privileges
echo.
pause

REM Check if PowerShell is available
powershell -Command "Get-Host" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PowerShell is not available
    echo Please install PowerShell 5.1 or later
    echo Download from: https://aka.ms/powershell
    pause
    exit /b 1
)

REM Check PowerShell version
for /f "tokens=*" %%i in ('powershell -Command "$PSVersionTable.PSVersion.Major"') do set PS_VERSION=%%i
if %PS_VERSION% LSS 5 (
    echo WARNING: PowerShell version %PS_VERSION% detected
    echo PowerShell 5.1 or later is recommended
    echo.
)

echo Starting ENFOR DATA Platform...
echo.

REM Run the PowerShell script
powershell -ExecutionPolicy Bypass -File "%~dp0start-enfor-data.ps1"

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo ERROR: Failed to start ENFOR DATA
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo.
    echo Common issues:
    echo  1. Missing dependencies - Run as Administrator
    echo  2. Port already in use - Close other applications
    echo  3. Database not configured - Check PostgreSQL installation
    echo.
    echo For help, see README.md or contact support
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ENFOR DATA Platform Started!
echo ========================================
echo.
echo Keep this window open while using the application
echo.
pause