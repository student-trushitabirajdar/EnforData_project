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
    Write-Status "This may take a few minutes..."
    try {
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        
        # Download and run Chocolatey installer
        $installScript = (New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')
        Invoke-Expression $installScript
        
        # Refresh environment to make choco available
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # Verify installation
        Start-Sleep -Seconds 3
        if (Test-Command "choco") {
            Write-Success "Chocolatey installed successfully"
            return $true
        } else {
            Write-Warning "Chocolatey installed but not immediately available"
            Write-Status "Please close and reopen this window, then run start.bat again"
            return $false
        }
    }
    catch {
        Write-Error "Failed to install Chocolatey: $($_.Exception.Message)"
        Write-Host ""
        Write-Host "Please install Chocolatey manually:" -ForegroundColor Yellow
        Write-Host "1. Open PowerShell as Administrator" -ForegroundColor Cyan
        Write-Host "2. Run this command:" -ForegroundColor Cyan
        Write-Host "   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" -ForegroundColor White
        Write-Host "3. Close PowerShell and run start.bat again" -ForegroundColor Cyan
        return $false
    }
}

# Function to install Node.js
function Install-NodeJS {
    Write-Status "Installing Node.js (this may take 5-10 minutes)..."
    try {
        choco install nodejs -y --force
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # Verify installation
        Start-Sleep -Seconds 3
        if (Test-Command "node") {
            $version = node --version
            Write-Success "Node.js installed successfully: $version"
            return $true
        } else {
            Write-Warning "Node.js installed but not immediately available"
            Write-Status "Please close this window and run start.bat again"
            return $false
        }
    }
    catch {
        Write-Error "Failed to install Node.js: $($_.Exception.Message)"
        Write-Status "Download manually from: https://nodejs.org/"
        return $false
    }
}

# Function to install Go
function Install-Go {
    Write-Status "Installing Go (this may take 5-10 minutes)..."
    try {
        choco install golang -y --force
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # Verify installation
        Start-Sleep -Seconds 3
        if (Test-Command "go") {
            $version = go version
            Write-Success "Go installed successfully: $version"
            return $true
        } else {
            Write-Warning "Go installed but not immediately available"
            Write-Status "Please close this window and run start.bat again"
            return $false
        }
    }
    catch {
        Write-Error "Failed to install Go: $($_.Exception.Message)"
        Write-Status "Download manually from: https://golang.org/dl/"
        return $false
    }
}

# Function to install PostgreSQL
function Install-PostgreSQL {
    Write-Status "Installing PostgreSQL (this may take 10-15 minutes)..."
    try {
        choco install postgresql -y --params '/Password:postgres' --force
        
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        Write-Success "PostgreSQL installed successfully"
        
        # Wait for PostgreSQL service to start
        Write-Status "Starting PostgreSQL service..."
        Start-Sleep -Seconds 10
        
        # Try to start the service if not running
        $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
        if ($pgService) {
            if ($pgService.Status -ne "Running") {
                Start-Service $pgService.Name -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 5
            }
            Write-Success "PostgreSQL service is running"
        } else {
            Write-Warning "PostgreSQL service not found - may need manual start"
        }
        
        # Verify installation
        if (Test-Command "psql") {
            Write-Success "PostgreSQL command-line tools available"
            return $true
        } else {
            Write-Warning "PostgreSQL installed but psql not immediately available"
            Write-Status "Please close this window and run start.bat again"
            return $false
        }
    }
    catch {
        Write-Error "Failed to install PostgreSQL: $($_.Exception.Message)"
        Write-Status "Download manually from: https://www.postgresql.org/download/windows/"
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
        Write-Host ""
        
        if ($isAdmin) {
            Write-Status "Attempting to install Chocolatey automatically..."
            if (-not (Install-Chocolatey)) {
                Write-Error "Chocolatey installation failed"
                Write-Host ""
                Write-Host "Alternative: Install software manually" -ForegroundColor Yellow
                Write-Host "1. Node.js: https://nodejs.org/ (Download and run installer)" -ForegroundColor Cyan
                Write-Host "2. Go: https://golang.org/dl/ (Download and run installer)" -ForegroundColor Cyan
                Write-Host "3. PostgreSQL: https://www.postgresql.org/download/windows/ (Download and run installer)" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "After manual installation, run start.bat again" -ForegroundColor Yellow
                return $false
            }
        } else {
            Write-Warning "Administrator privileges required to install Chocolatey"
            Write-Host ""
            Write-Host "Choose an option:" -ForegroundColor Yellow
            Write-Host "1. Restart as Administrator (Recommended)" -ForegroundColor Cyan
            Write-Host "2. Install Chocolatey manually" -ForegroundColor Cyan
            Write-Host "3. Install Node.js, Go, and PostgreSQL manually" -ForegroundColor Cyan
            Write-Host ""
            
            $choice = Read-Host "Enter choice (1, 2, or 3)"
            
            if ($choice -eq "1") {
                Write-Status "Please run start.bat again as Administrator"
                Write-Host "Right-click start.bat -> Run as administrator" -ForegroundColor Cyan
                return $false
            } elseif ($choice -eq "2") {
                Write-Host ""
                Write-Host "To install Chocolatey manually:" -ForegroundColor Yellow
                Write-Host "1. Right-click PowerShell -> Run as Administrator" -ForegroundColor Cyan
                Write-Host "2. Run: Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" -ForegroundColor White
                Write-Host "3. Close PowerShell and run start.bat again" -ForegroundColor Cyan
                return $false
            } else {
                Write-Host ""
                Write-Host "Manual Installation Links:" -ForegroundColor Yellow
                Write-Host "1. Node.js: https://nodejs.org/ (Download LTS version)" -ForegroundColor Cyan
                Write-Host "2. Go: https://golang.org/dl/ (Download latest version)" -ForegroundColor Cyan
                Write-Host "3. PostgreSQL: https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "After installation, run start.bat again" -ForegroundColor Yellow
                return $false
            }
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
    
    # Auto-detect if setup is needed
    $needsSetup = $false
    
    if (-not (Test-Command "node")) {
        Write-Warning "Node.js not found - setup required"
        $needsSetup = $true
    }
    
    if (-not (Test-Command "go")) {
        Write-Warning "Go not found - setup required"
        $needsSetup = $true
    }
    
    if (-not (Test-Command "psql")) {
        Write-Warning "PostgreSQL not found - setup required"
        $needsSetup = $true
    }
    
    # Run setup automatically if needed or requested
    if ($Setup -or $needsSetup) {
        Write-Host ""
        Write-Status "🔧 Setup required - installing missing dependencies..."
        Write-Host ""
        
        # Check for admin rights
        $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
        
        if (-not $isAdmin) {
            Write-Warning "Administrator privileges required for automatic installation"
            Write-Host ""
            Write-Host "Please choose an option:" -ForegroundColor Yellow
            Write-Host "1. Restart this script as Administrator (Recommended)" -ForegroundColor Cyan
            Write-Host "2. Install dependencies manually" -ForegroundColor Cyan
            Write-Host ""
            
            $choice = Read-Host "Enter choice (1 or 2)"
            
            if ($choice -eq "1") {
                Write-Status "Restarting with administrator privileges..."
                $scriptPath = $MyInvocation.MyCommand.Path
                Start-Process powershell -Verb RunAs -ArgumentList "-ExecutionPolicy Bypass -File `"$scriptPath`" -Setup"
                exit 0
            } else {
                Write-Host ""
                Write-Host "Manual Installation Required:" -ForegroundColor Yellow
                Write-Host "1. Node.js: https://nodejs.org/ (Download LTS version)" -ForegroundColor Cyan
                Write-Host "2. Go: https://golang.org/dl/ (Download latest version)" -ForegroundColor Cyan
                Write-Host "3. PostgreSQL: https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "After installation, run this script again." -ForegroundColor Yellow
                exit 1
            }
        }
        
        if (-not (Start-Setup)) {
            Write-Error "Setup failed. Please resolve issues and try again."
            exit 1
        }
        Write-Host ""
        Write-Success "Setup completed! Continuing with startup..."
        Write-Host ""
        
        # Refresh environment variables after installation
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    }
    
    # Check prerequisites
    Write-Status "Checking prerequisites..."
    
    # Check Node.js
    if (-not (Test-Command "node")) {
        Write-Error "Node.js is not installed. Please restart the script or install manually."
        Write-Status "Download from: https://nodejs.org/"
        exit 1
    }
    $nodeVersion = node --version
    Write-Success "Node.js found: $nodeVersion"
    
    # Check Go
    if (-not (Test-Command "go")) {
        Write-Error "Go is not installed. Please restart the script or install manually."
        Write-Status "Download from: https://golang.org/dl/"
        exit 1
    }
    $goVersion = go version
    Write-Success "Go found: $goVersion"
    
    # Check PostgreSQL
    if (-not (Test-Command "psql")) {
        Write-Error "PostgreSQL is not installed. Please restart the script or install manually."
        Write-Status "Download from: https://www.postgresql.org/download/windows/"
        exit 1
    }
    Write-Success "PostgreSQL found"
    
    # Test database connection
    Write-Status "Checking database connection..."
    $dbConnected = $false
    try {
        $env:PGPASSWORD = "enfor_data"
        $null = psql -U backend -d enfor_data -h localhost -c "SELECT 1;" 2>$null
        Write-Success "Database connection verified"
        $dbConnected = $true
    }
    catch {
        Write-Warning "Cannot connect to enfor_data database"
    }
    
    # If database connection failed, try to set it up
    if (-not $dbConnected) {
        Write-Status "Attempting to setup database..."
        
        # Check if PostgreSQL service is running
        $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
        if ($pgService -and $pgService.Status -ne "Running") {
            Write-Status "Starting PostgreSQL service..."
            Start-Service $pgService.Name
            Start-Sleep -Seconds 5
        }
        
        # Try to create database with default postgres user
        try {
            $env:PGPASSWORD = "postgres"
            $createDbScript = @"
DO `$`$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'enfor_data') THEN
        CREATE DATABASE enfor_data;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'backend') THEN
        CREATE USER backend WITH PASSWORD 'enfor_data';
    END IF;
    
    GRANT ALL PRIVILEGES ON DATABASE enfor_data TO backend;
END
`$`$;
"@
            $createDbScript | psql -U postgres -h localhost 2>$null
            Write-Success "Database setup completed"
            
            # Verify connection again
            $env:PGPASSWORD = "enfor_data"
            $null = psql -U backend -d enfor_data -h localhost -c "SELECT 1;" 2>$null
            Write-Success "Database connection verified"
            $dbConnected = $true
        }
        catch {
            Write-Warning "Automatic database setup failed"
            Write-Host ""
            Write-Host "Please setup database manually:" -ForegroundColor Yellow
            Write-Host "1. Open pgAdmin or psql as postgres user" -ForegroundColor Cyan
            Write-Host "2. Run these commands:" -ForegroundColor Cyan
            Write-Host "   CREATE DATABASE enfor_data;" -ForegroundColor White
            Write-Host "   CREATE USER backend WITH PASSWORD 'enfor_data';" -ForegroundColor White
            Write-Host "   GRANT ALL PRIVILEGES ON DATABASE enfor_data TO backend;" -ForegroundColor White
            Write-Host ""
            $continue = Read-Host "Continue anyway? (y/n)"
            if ($continue -ne "y" -and $continue -ne "Y") {
                exit 1
            }
        }
    }
    
    # Run database migrations if connected
    if ($dbConnected) {
        Write-Status "Running database migrations..."
        try {
            $env:PGPASSWORD = "enfor_data"
            $migrationFiles = Get-ChildItem "backend\migrations\*.sql" | Sort-Object Name
            
            foreach ($migration in $migrationFiles) {
                Write-Status "Running migration: $($migration.Name)"
                Get-Content $migration.FullName | psql -U backend -d enfor_data -h localhost 2>$null
            }
            
            Write-Success "Database migrations completed"
        }
        catch {
            Write-Warning "Some migrations may have failed (this is OK if tables already exist)"
        }
    }
    
    Write-Host ""
    
    # Create backend config if it doesn't exist
    Write-Status "Checking backend configuration..."
    if (-not (Test-Path "backend\config.env")) {
        Write-Status "Creating backend configuration file..."
        try {
            if (Test-Path "backend\config.env.example") {
                Copy-Item "backend\config.env.example" "backend\config.env"
                Write-Success "Configuration file created from template"
            } else {
                # Create default config
                $defaultConfig = @"
# ENFOR DATA Backend Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=backend
DB_PASSWORD=enfor_data
DB_NAME=enfor_data
DB_SSLMODE=disable
PORT=8080
GIN_MODE=release
JWT_SECRET=enfor-data-secret-key-$(Get-Random)
JWT_EXPIRY=24h
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:3001
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=10485760
ENVIRONMENT=development
"@
                $defaultConfig | Out-File -FilePath "backend\config.env" -Encoding UTF8
                Write-Success "Default configuration file created"
            }
        }
        catch {
            Write-Warning "Could not create config file automatically"
            Write-Status "Please create backend\config.env manually"
        }
    } else {
        Write-Success "Configuration file found"
    }
    
    # Create uploads directory if it doesn't exist
    if (-not (Test-Path "backend\uploads")) {
        New-Item -ItemType Directory -Path "backend\uploads" -Force | Out-Null
        Write-Success "Uploads directory created"
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