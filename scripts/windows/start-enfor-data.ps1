# ENFOR DATA - Windows PowerShell Startup Script
# This script starts both backend and frontend servers on Windows

param(
    [switch]$Setup,
    [switch]$SkipBrowser
)

# Colors for output (Windows PowerShell compatible)
function Write-Status {
    param($Message)
    Write-Host "[ENFOR DATA] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check if a port is in use
function Test-Port {
    param($Port)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
        return $connection
    }
    catch {
        return $false
    }
}

# Function to kill processes on a specific port
function Stop-ProcessOnPort {
    param($Port)
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($processes) {
            Write-Warning "Stopping existing processes on port $Port"
            foreach ($pid in $processes) {
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
            Start-Sleep -Seconds 2
        }
    }
    catch {
        # Port might not be in use, which is fine
    }
}

# Function to wait for service to be ready
function Wait-ForService {
    param($Url, $ServiceName, $MaxAttempts = 30)
    
    Write-Status "Waiting for $ServiceName to be ready..."
    
    for ($i = 1; $i -le $MaxAttempts; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Success "$ServiceName is ready!"
                return $true
            }
        }
        catch {
            # Service not ready yet
        }
        
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 1
    }
    
    Write-Error "$ServiceName failed to start within $MaxAttempts seconds"
    return $false
}

# Function to install Chocolatey
function Install-Chocolatey {
    Write-Status "Installing Chocolatey package manager..."
    try {
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        Write-Success "Chocolatey installed successfully"
        return $true
    }
    catch {
        Write-Error "Failed to install Chocolatey: $($_.Exception.Message)"
        return $false
    }
}

# Function to install Node.js
function Install-NodeJS {
    Write-Status "Installing Node.js..."
    try {
        choco install nodejs -y
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        Write-Success "Node.js installed successfully"
        return $true
    }
    catch {
        Write-Error "Failed to install Node.js: $($_.Exception.Message)"
        return $false
    }
}

# Function to install Go
function Install-Go {
    Write-Status "Installing Go..."
    try {
        choco install golang -y
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        Write-Success "Go installed successfully"
        return $true
    }
    catch {
        Write-Error "Failed to install Go: $($_.Exception.Message)"
        return $false
    }
}

# Function to install PostgreSQL
function Install-PostgreSQL {
    Write-Status "Installing PostgreSQL..."
    try {
        choco install postgresql -y --params '/Password:enfor_data'
        Write-Success "PostgreSQL installed successfully"
        Write-Warning "PostgreSQL service may need to be started manually"
        return $true
    }
    catch {
        Write-Error "Failed to install PostgreSQL: $($_.Exception.Message)"
        return $false
    }
}

# Function to setup database
function Setup-Database {
    Write-Status "Setting up database..."
    try {
        # Wait for PostgreSQL to be ready
        Start-Sleep -Seconds 10
        
        # Create database and user
        $createDbScript = @"
CREATE DATABASE enfor_data;
CREATE USER backend WITH PASSWORD 'enfor_data';
GRANT ALL PRIVILEGES ON DATABASE enfor_data TO backend;
"@
        
        $createDbScript | psql -U postgres -h localhost
        Write-Success "Database setup completed"
        return $true
    }
    catch {
        Write-Warning "Database setup may need manual configuration"
        Write-Status "Please run the following SQL commands manually:"
        Write-Host "CREATE DATABASE enfor_data;" -ForegroundColor Cyan
        Write-Host "CREATE USER backend WITH PASSWORD 'enfor_data';" -ForegroundColor Cyan
        Write-Host "GRANT ALL PRIVILEGES ON DATABASE enfor_data TO backend;" -ForegroundColor Cyan
        return $false
    }
}

# Main setup function
function Start-Setup {
    Write-Status "Starting Windows setup for ENFOR DATA..."
    Write-Host ""
    
    # Check if running as administrator
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
    if (-not $isAdmin) {
        Write-Warning "Some installations may require administrator privileges"
        Write-Status "Consider running PowerShell as Administrator for automatic installations"
        Write-Host ""
    }
    
    # Install Chocolatey if not present
    if (-not (Test-Command "choco")) {
        Write-Status "Chocolatey package manager not found"
        if ($isAdmin) {
            Install-Chocolatey
        } else {
            Write-Error "Chocolatey installation requires administrator privileges"
            Write-Status "Please install Chocolatey manually: https://chocolatey.org/install"
            return $false
        }
    } else {
        Write-Success "Chocolatey found"
    }
    
    # Check and install Node.js
    if (-not (Test-Command "node")) {
        Write-Status "Node.js not found"
        if ($isAdmin -and (Test-Command "choco")) {
            Install-NodeJS
        } else {
            Write-Error "Please install Node.js manually: https://nodejs.org/"
            return $false
        }
    } else {
        $nodeVersion = node --version
        Write-Success "Node.js found: $nodeVersion"
    }
    
    # Check and install Go
    if (-not (Test-Command "go")) {
        Write-Status "Go not found"
        if ($isAdmin -and (Test-Command "choco")) {
            Install-Go
        } else {
            Write-Error "Please install Go manually: https://golang.org/dl/"
            return $false
        }
    } else {
        $goVersion = go version
        Write-Success "Go found: $goVersion"
    }
    
    # Check PostgreSQL
    if (-not (Test-Command "psql")) {
        Write-Status "PostgreSQL not found"
        if ($isAdmin -and (Test-Command "choco")) {
            Install-PostgreSQL
            Setup-Database
        } else {
            Write-Error "Please install PostgreSQL manually: https://www.postgresql.org/download/windows/"
            Write-Status "After installation, create database 'enfor_data' and user 'backend'"
            return $false
        }
    } else {
        Write-Success "PostgreSQL found"
        # Test database connection
        try {
            $null = psql -U backend -d enfor_data -h localhost -c "SELECT 1;" 2>$null
            Write-Success "Database connection verified"
        }
        catch {
            Write-Warning "Database connection failed - may need manual setup"
            Setup-Database
        }
    }
    
    Write-Success "Windows setup completed!"
    return $true
}

# Main startup function
function Start-EnforData {
    Write-Status "Starting ENFOR DATA Platform on Windows..."
    Write-Host ""
    
    # Check if we're in the right directory
    if (-not (Test-Path "package.json") -or -not (Test-Path "backend")) {
        Write-Error "Please run this script from the ENFOR DATA project root directory"
        exit 1
    }
    
    # Run setup if requested
    if ($Setup) {
        if (-not (Start-Setup)) {
            Write-Error "Setup failed. Please resolve issues and try again."
            exit 1
        }
        Write-Host ""
    }
    
    # Check prerequisites
    Write-Status "Checking prerequisites..."
    
    # Check Node.js
    if (-not (Test-Command "node")) {
        Write-Error "Node.js is not installed. Run with -Setup flag or install manually."
        exit 1
    }
    $nodeVersion = node --version
    Write-Success "Node.js found: $nodeVersion"
    
    # Check Go
    if (-not (Test-Command "go")) {
        Write-Error "Go is not installed. Run with -Setup flag or install manually."
        exit 1
    }
    $goVersion = go version
    Write-Success "Go found: $goVersion"
    
    # Check PostgreSQL
    if (-not (Test-Command "psql")) {
        Write-Error "PostgreSQL is not installed. Run with -Setup flag or install manually."
        exit 1
    }
    Write-Success "PostgreSQL found"
    
    # Test database connection
    try {
        $null = psql -U backend -d enfor_data -h localhost -c "SELECT 1;" 2>$null
        Write-Success "Database connection verified"
    }
    catch {
        Write-Error "Cannot connect to enfor_data database."
        Write-Status "Please ensure PostgreSQL is running and database is configured."
        exit 1
    }
    
    Write-Host ""
    
    # Install dependencies
    Write-Status "Installing frontend dependencies..."
    try {
        npm install --silent
        Write-Success "Frontend dependencies installed"
    }
    catch {
        Write-Error "Failed to install frontend dependencies"
        exit 1
    }
    
    Write-Status "Installing backend dependencies..."
    try {
        Set-Location backend
        go mod tidy
        Write-Success "Backend dependencies installed"
        Set-Location ..
    }
    catch {
        Write-Error "Failed to install backend dependencies"
        Set-Location ..
        exit 1
    }
    
    Write-Host ""
    
    # Build backend
    Write-Status "Building backend server..."
    try {
        Set-Location backend
        go build -o enfor-backend.exe cmd/server/main.go
        Write-Success "Backend server built successfully"
        Set-Location ..
    }
    catch {
        Write-Error "Failed to build backend server"
        Set-Location ..
        exit 1
    }
    
    Write-Host ""
    
    # Clean up existing processes
    Write-Status "Cleaning up existing processes..."
    
    # Stop processes on ports
    Stop-ProcessOnPort 8080  # Backend
    Stop-ProcessOnPort 3000  # Frontend
    Stop-ProcessOnPort 3001  # Frontend alternative
    Stop-ProcessOnPort 5173  # Vite default
    
    # Kill existing processes by name
    Get-Process -Name "enfor-backend" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*vite*"} | Stop-Process -Force
    
    Start-Sleep -Seconds 2
    Write-Success "Cleanup completed"
    
    Write-Host ""
    
    # Start backend server
    Write-Status "Starting backend server..."
    try {
        Set-Location backend
        $backendProcess = Start-Process -FilePath ".\enfor-backend.exe" -PassThru -WindowStyle Hidden
        $backendProcess.Id | Out-File -FilePath "..\backend.pid" -Encoding ASCII
        Set-Location ..
        
        # Wait for backend to be ready
        if (Wait-ForService "http://localhost:8080/health" "Backend server") {
            Write-Success "Backend server started successfully (PID: $($backendProcess.Id))"
        } else {
            Write-Error "Backend server failed to start"
            if (Test-Path "backend.log") {
                Get-Content "backend.log" | Write-Host
            }
            exit 1
        }
    }
    catch {
        Write-Error "Failed to start backend server: $($_.Exception.Message)"
        Set-Location ..
        exit 1
    }
    
    Write-Host ""
    
    # Start frontend server
    Write-Status "Starting frontend development server..."
    try {
        $frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
        $frontendProcess.Id | Out-File -FilePath "frontend.pid" -Encoding ASCII
        
        # Wait for frontend to be ready (try multiple ports)
        $frontendUrl = ""
        $ports = @(3000, 3001, 5173)
        
        Start-Sleep -Seconds 5
        
        foreach ($port in $ports) {
            if (Test-Port $port) {
                $frontendUrl = "http://localhost:$port"
                break
            }
        }
        
        if ($frontendUrl) {
            Write-Success "Frontend server started successfully (PID: $($frontendProcess.Id))"
        } else {
            Write-Error "Frontend server failed to start"
            if (Test-Path "frontend.log") {
                Get-Content "frontend.log" | Write-Host
            }
            exit 1
        }
    }
    catch {
        Write-Error "Failed to start frontend server: $($_.Exception.Message)"
        exit 1
    }
    
    Write-Host ""
    
    # Display status
    Write-Status "🎉 ENFOR DATA Platform is now running on Windows!"
    Write-Host ""
    Write-Host "📊 Backend API:     http://localhost:8080" -ForegroundColor Green
    Write-Host "🌐 Frontend Web:    $frontendUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Demo Login Credentials:" -ForegroundColor Blue
    Write-Host "   Broker:          broker@example.com / password123"
    Write-Host "   Channel Partner: builder@example.com / password123"
    Write-Host "   Admin:           admin@example.com / password123"
    Write-Host ""
    Write-Host "🛑 To stop servers:" -ForegroundColor Yellow
    Write-Host "   .\stop-enfor-data.ps1"
    Write-Host ""
    
    # Open browser
    if (-not $SkipBrowser) {
        $openBrowser = Read-Host "Open website in browser? (y/n)"
        if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
            Start-Process $frontendUrl
        }
    }
}

# Run main function
try {
    Start-EnforData
}
catch {
    Write-Error "Script failed: $($_.Exception.Message)"
    exit 1
}