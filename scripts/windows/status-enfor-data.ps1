# ENFOR DATA - Windows PowerShell Status Check Script
# This script checks the status of both backend and frontend servers on Windows

# Colors for output
function Write-Status {
    param($Message)
    Write-Host "[ENFOR DATA] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Function to check if a service is responding
function Test-Service {
    param($Url, $Name)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Success "$Name is running"
            return $true
        }
    }
    catch {
        Write-Error "$Name is not responding"
        return $false
    }
}

# Function to check if a port is in use
function Test-Port {
    param($Port, $Name)
    
    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($connections) {
            $pid = $connections[0].OwningProcess
            Write-Success "$Name is running on port $Port (PID: $pid)"
            return $true
        } else {
            Write-Error "$Name is not running on port $Port"
            return $false
        }
    }
    catch {
        Write-Error "$Name is not running on port $Port"
        return $false
    }
}

function Get-EnforDataStatus {
    Write-Status "ENFOR DATA Platform Status Check (Windows)"
    Write-Host ""
    
    # Check backend
    Write-Host "Backend Server:" -ForegroundColor Blue
    Test-Service "http://localhost:8080/health" "Backend API"
    Test-Port 8080 "Backend process"
    Write-Host ""
    
    # Check frontend (try multiple ports)
    Write-Host "Frontend Server:" -ForegroundColor Blue
    $frontendRunning = $false
    
    $ports = @(3000, 3001, 5173)
    foreach ($port in $ports) {
        try {
            $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
            if ($connections) {
                $pid = $connections[0].OwningProcess
                Write-Success "Frontend is running on port $port (PID: $pid)"
                Write-Host "   🌐 Access at: http://localhost:$port" -ForegroundColor Green
                $frontendRunning = $true
                break
            }
        }
        catch {
            # Port not in use
        }
    }
    
    if (-not $frontendRunning) {
        Write-Error "Frontend is not running"
    }
    
    Write-Host ""
    
    # Check database
    Write-Host "Database:" -ForegroundColor Blue
    
    # Check if PostgreSQL service is running
    $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if ($pgService -and $pgService.Status -eq "Running") {
        Write-Success "PostgreSQL service is running"
        
        # Test database connection
        try {
            $null = psql -U backend -d enfor_data -h localhost -c "SELECT COUNT(*) FROM users;" 2>$null
            $userCount = psql -U backend -d enfor_data -h localhost -t -c "SELECT COUNT(*) FROM users;" 2>$null
            if ($userCount) {
                $userCount = $userCount.Trim()
                Write-Success "Database connection OK ($userCount users registered)"
            } else {
                Write-Success "Database connection OK"
            }
        }
        catch {
            Write-Error "Cannot connect to enfor_data database"
        }
    } else {
        Write-Error "PostgreSQL service is not running"
        Write-Status "Start PostgreSQL service: net start postgresql-x64-13 (or similar)"
    }
    
    Write-Host ""
    
    # Show process information
    Write-Host "Process Information:" -ForegroundColor Blue
    
    # Backend processes
    $backendProcesses = Get-Process -Name "enfor-backend" -ErrorAction SilentlyContinue
    if ($backendProcesses) {
        $pids = $backendProcesses | ForEach-Object { $_.Id }
        Write-Host "Backend processes: $($pids -join ', ')"
    }
    
    # Frontend processes (Node.js running Vite)
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        try {
            $_.CommandLine -like "*vite*" -or $_.CommandLine -like "*dev*"
        }
        catch {
            $false
        }
    }
    if ($nodeProcesses) {
        $pids = $nodeProcesses | ForEach-Object { $_.Id }
        Write-Host "Frontend processes: $($pids -join ', ')"
    }
    
    # Log files
    Write-Host ""
    Write-Host "Log Files:" -ForegroundColor Blue
    
    if (Test-Path "backend.log") {
        $backendSize = (Get-Item "backend.log").Length
        $backendSizeKB = [math]::Round($backendSize / 1KB, 2)
        Write-Host "Backend log: backend.log ($backendSizeKB KB)"
    }
    
    if (Test-Path "frontend.log") {
        $frontendSize = (Get-Item "frontend.log").Length
        $frontendSizeKB = [math]::Round($frontendSize / 1KB, 2)
        Write-Host "Frontend log: frontend.log ($frontendSizeKB KB)"
    }
    
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  Start:  .\start-enfor-data.ps1"
    Write-Host "  Stop:   .\stop-enfor-data.ps1"
    Write-Host "  Status: .\status-enfor-data.ps1"
    Write-Host "  Setup:  .\start-enfor-data.ps1 -Setup"
}

# Run main function
try {
    Get-EnforDataStatus
}
catch {
    Write-Error "Script failed: $($_.Exception.Message)"
    exit 1
}