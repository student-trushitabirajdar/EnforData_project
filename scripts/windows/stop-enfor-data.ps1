# ENFOR DATA - Windows PowerShell Stop Script
# This script stops both backend and frontend servers on Windows

# Colors for output
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

# Function to stop processes on a specific port
function Stop-ProcessOnPort {
    param($Port)
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($processes) {
            Write-Status "Stopping processes on port $Port"
            foreach ($pid in $processes) {
                try {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                }
                catch {
                    # Process might already be stopped
                }
            }
        }
    }
    catch {
        # Port might not be in use, which is fine
    }
}

function Stop-EnforData {
    Write-Status "Stopping ENFOR DATA Platform on Windows..."
    Write-Host ""
    
    # Stop backend server
    if (Test-Path "backend.pid") {
        try {
            $backendPid = Get-Content "backend.pid" -ErrorAction SilentlyContinue
            if ($backendPid) {
                $process = Get-Process -Id $backendPid -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Status "Stopping backend server (PID: $backendPid)"
                    Stop-Process -Id $backendPid -Force -ErrorAction SilentlyContinue
                }
            }
            Remove-Item "backend.pid" -ErrorAction SilentlyContinue
        }
        catch {
            Write-Warning "Could not stop backend server cleanly"
        }
    }
    
    # Stop frontend server
    if (Test-Path "frontend.pid") {
        try {
            $frontendPid = Get-Content "frontend.pid" -ErrorAction SilentlyContinue
            if ($frontendPid) {
                $process = Get-Process -Id $frontendPid -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Status "Stopping frontend server (PID: $frontendPid)"
                    Stop-Process -Id $frontendPid -Force -ErrorAction SilentlyContinue
                }
            }
            Remove-Item "frontend.pid" -ErrorAction SilentlyContinue
        }
        catch {
            Write-Warning "Could not stop frontend server cleanly"
        }
    }
    
    # Kill any remaining processes
    Write-Status "Cleaning up remaining processes..."
    
    # Kill backend processes
    Get-Process -Name "enfor-backend" -ErrorAction SilentlyContinue | Stop-Process -Force
    
    # Kill frontend processes (Node.js processes running Vite)
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        try {
            $_.CommandLine -like "*vite*" -or $_.CommandLine -like "*dev*"
        }
        catch {
            $false
        }
    } | Stop-Process -Force
    
    # Stop processes on specific ports
    Stop-ProcessOnPort 8080  # Backend
    Stop-ProcessOnPort 3000  # Frontend
    Stop-ProcessOnPort 3001  # Frontend alternative
    Stop-ProcessOnPort 5173  # Vite default
    
    # Clean up log files (optional)
    $logFiles = @("backend.log", "frontend.log")
    $hasLogs = $false
    
    foreach ($logFile in $logFiles) {
        if (Test-Path $logFile) {
            $hasLogs = $true
            break
        }
    }
    
    if ($hasLogs) {
        $deleteLogs = Read-Host "Delete log files? (y/n)"
        if ($deleteLogs -eq "y" -or $deleteLogs -eq "Y") {
            foreach ($logFile in $logFiles) {
                if (Test-Path $logFile) {
                    Remove-Item $logFile -ErrorAction SilentlyContinue
                }
            }
            Write-Success "Log files deleted"
        }
    }
    
    Write-Success "ENFOR DATA Platform stopped successfully"
}

# Run main function
try {
    Stop-EnforData
}
catch {
    Write-Error "Script failed: $($_.Exception.Message)"
    exit 1
}