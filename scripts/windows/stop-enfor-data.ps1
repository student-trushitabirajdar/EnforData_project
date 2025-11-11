# ENFOR DATA - Windows PowerShell Stop Script
# This script stops both backend and frontend servers

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

Write-Status "Stopping ENFOR DATA Platform..."
Write-Host ""

# Function to stop processes on a specific port
function Stop-ProcessOnPort {
    param($Port, $Name)
    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($connections) {
            $processes = $connections | Select-Object -ExpandProperty OwningProcess -Unique
            foreach ($pid in $processes) {
                $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Status "Stopping $Name (PID: $pid)..."
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                }
            }
            Write-Success "$Name stopped"
        } else {
            Write-Warning "$Name not running on port $Port"
        }
    }
    catch {
        Write-Warning "Could not stop $Name on port $Port"
    }
}

# Stop backend (port 8080)
Stop-ProcessOnPort 8080 "Backend server"

# Stop frontend (multiple possible ports)
Stop-ProcessOnPort 5173 "Frontend server (Vite)"
Stop-ProcessOnPort 3000 "Frontend server"
Stop-ProcessOnPort 3001 "Frontend server (alt)"

# Stop by process name
Write-Status "Stopping processes by name..."

$backendProcesses = Get-Process -Name "enfor-backend" -ErrorAction SilentlyContinue
if ($backendProcesses) {
    $backendProcesses | Stop-Process -Force
    Write-Success "Backend processes stopped"
}

$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    # Only stop node processes that are likely our frontend
    foreach ($proc in $nodeProcesses) {
        try {
            $cmdLine = (Get-WmiObject Win32_Process -Filter "ProcessId = $($proc.Id)").CommandLine
            if ($cmdLine -like "*vite*" -or $cmdLine -like "*enfor*") {
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
                Write-Success "Frontend process stopped (PID: $($proc.Id))"
            }
        }
        catch {
            # Ignore errors
        }
    }
}

# Clean up PID files
if (Test-Path "backend.pid") {
    Remove-Item "backend.pid" -Force
}

if (Test-Path "frontend.pid") {
    Remove-Item "frontend.pid" -Force
}

Write-Host ""
Write-Success "🛑 ENFOR DATA Platform stopped successfully!"
Write-Host ""
Write-Host "To start again, run: start.bat" -ForegroundColor Cyan
Write-Host ""
