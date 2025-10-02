@echo off
REM ENFOR DATA - Windows Setup Script
REM This batch file helps setup the development environment on Windows

echo ========================================
echo ENFOR DATA - Windows Setup
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Not running as administrator
    echo Some installations may fail without admin privileges
    echo.
    echo Right-click this file and select "Run as administrator" for best results
    echo.
    pause
)

echo Checking prerequisites...
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is NOT installed
    echo Please download and install from: https://nodejs.org/
    echo.
) else (
    echo ✅ Node.js is installed
    node --version
)

REM Check Go
go version >nul 2>&1
if %errorlevel% neq 0 (
    echo Go is NOT installed
    echo Please download and install from: https://golang.org/dl/
    echo.
) else (
    echo ✅ Go is installed
    go version
)

REM Check PostgreSQL
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo PostgreSQL is NOT installed
    echo Please download and install from: https://www.postgresql.org/download/windows/
    echo.
    echo During installation:
    echo - Set password to: enfor_data
    echo - Remember the port (usually 5432)
    echo - Enable all components
    echo.
) else (
    echo ✅ PostgreSQL is installed
    psql --version
)

REM Check Git (optional but recommended)
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Git is NOT installed (optional)
    echo Download from: https://git-scm.com/download/win
    echo.
) else (
    echo ✅ Git is installed
    git --version
)

echo.
echo ========================================
echo Manual Installation Links:
echo ========================================
echo.
echo Node.js:    https://nodejs.org/
echo Go:         https://golang.org/dl/
echo PostgreSQL: https://www.postgresql.org/download/windows/
echo Git:        https://git-scm.com/download/win
echo.
echo ========================================
echo Database Setup (after PostgreSQL install):
echo ========================================
echo.
echo 1. Open pgAdmin or psql command line
echo 2. Connect as 'postgres' user
echo 3. Run these commands:
echo.
echo    CREATE DATABASE enfor_data;
echo    CREATE USER backend WITH PASSWORD 'enfor_data';
echo    GRANT ALL PRIVILEGES ON DATABASE enfor_data TO backend;
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Install missing software from links above
echo 2. Setup the database as shown
echo 3. Run: start-enfor-data.bat
echo.

pause