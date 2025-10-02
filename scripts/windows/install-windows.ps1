# ENFOR DATA - Windows Automatic Installer
# This script automatically downloads and installs all prerequisites

param(
    [switch]$Force,
    [switch]$SkipChocolatey
)

# Require Administrator privileges
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires Administrator privileges" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

# Colors for output
function Write-Status {
    param($Message)
    Write-Host "[INSTALLER] $Message" -ForegroundColor Blue
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

# Function to download and install from URL
function Install-FromUrl {
    param($Url, $OutputPath, $InstallerArgs = "/S")
    
    try {
        Write-Status "Downloading from $Url..."
        Invoke-WebRequest -Uri $Url -OutFile $OutputPath -UseBasicParsing
        
        Write-Status "Installing $OutputPath..."
        Start-Process -FilePath $OutputPath -ArgumentList $InstallerArgs -Wait
        
        Remove-Item $OutputPath -ErrorAction SilentlyContinue
        return $true
    }
    catch {
        Write-Error "Failed to install from $Url : $($_.Exception.Message)"
        return $false
    }
}

function Install-Prerequisites {
    Write-Status "🚀 ENFOR DATA - Windows Automatic Installer"
    Write-Host ""
    Write-Status "This will install Node.js, Go, PostgreSQL, and Git"
    Write-Host ""
    
    if (-not $Force) {
        $confirm = Read-Host "Continue with installation? (y/n)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-Status "Installation cancelled"
            exit 0
        }
    }
    
    # Create temp directory
    $tempDir = "$env:TEMP\enfor-installer"
    if (-not (Test-Path $tempDir)) {
        New-Item -ItemType Directory -Path $tempDir | Out-Null
    }
    
    # Install Chocolatey first (if not skipped)
    if (-not $SkipChocolatey -and -not (Test-Command "choco")) {
        Write-Status "Installing Chocolatey package manager..."
        try {
            Set-ExecutionPolicy Bypass -Scope Process -Force
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
            Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
            
            # Refresh environment
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            
            Write-Success "Chocolatey installed successfully"
        }
        catch {
            Write-Warning "Chocolatey installation failed, will use direct downloads"
            $SkipChocolatey = $true
        }
    }
    
    # Install Node.js
    if (-not (Test-Command "node")) {
        Write-Status "Installing Node.js..."
        
        if (-not $SkipChocolatey -and (Test-Command "choco")) {
            try {
                choco install nodejs -y
                Write-Success "Node.js installed via Chocolatey"
            }
            catch {
                Write-Warning "Chocolatey install failed, trying direct download"
                $nodeUrl = "https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi"
                Install-FromUrl $nodeUrl "$tempDir\nodejs.msi" "/quiet"
            }
        } else {
            # Direct download
            $nodeUrl = "https://nodejs.org/dist/v18.17.0/node-v18.17.0-x64.msi"
            if (Install-FromUrl $nodeUrl "$tempDir\nodejs.msi" "/quiet") {
                Write-Success "Node.js installed successfully"
            }
        }
    } else {
        Write-Success "Node.js already installed"
    }
    
    # Install Go
    if (-not (Test-Command "go")) {
        Write-Status "Installing Go..."
        
        if (-not $SkipChocolatey -and (Test-Command "choco")) {
            try {
                choco install golang -y
                Write-Success "Go installed via Chocolatey"
            }
            catch {
                Write-Warning "Chocolatey install failed, trying direct download"
                $goUrl = "https://go.dev/dl/go1.21.0.windows-amd64.msi"
                Install-FromUrl $goUrl "$tempDir\golang.msi" "/quiet"
            }
        } else {
            # Direct download
            $goUrl = "https://go.dev/dl/go1.21.0.windows-amd64.msi"
            if (Install-FromUrl $goUrl "$tempDir\golang.msi" "/quiet") {
                Write-Success "Go installed successfully"
            }
        }
    } else {
        Write-Success "Go already installed"
    }
    
    # Install PostgreSQL
    if (-not (Test-Command "psql")) {
        Write-Status "Installing PostgreSQL..."
        
        if (-not $SkipChocolatey -and (Test-Command "choco")) {
            try {
                choco install postgresql -y --params '/Password:enfor_data'
                Write-Success "PostgreSQL installed via Chocolatey"
            }
            catch {
                Write-Warning "Chocolatey install failed"
                Write-Status "Please install PostgreSQL manually from: https://www.postgresql.org/download/windows/"
            }
        } else {
            Write-Status "Please install PostgreSQL manually from: https://www.postgresql.org/download/windows/"
            Write-Status "Set the password to: enfor_data"
        }
    } else {
        Write-Success "PostgreSQL already installed"
    }
    
    # Install Git (optional)
    if (-not (Test-Command "git")) {
        Write-Status "Installing Git..."
        
        if (-not $SkipChocolatey -and (Test-Command "choco")) {
            try {
                choco install git -y
                Write-Success "Git installed via Chocolatey"
            }
            catch {
                Write-Warning "Git installation failed"
                Write-Status "You can install Git manually from: https://git-scm.com/download/win"
            }
        } else {
            $gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.41.0.windows.3/Git-2.41.0.3-64-bit.exe"
            if (Install-FromUrl $gitUrl "$tempDir\git.exe" "/VERYSILENT /NORESTART") {
                Write-Success "Git installed successfully"
            }
        }
    } else {
        Write-Success "Git already installed"
    }
    
    # Refresh environment variables
    Write-Status "Refreshing environment variables..."
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    # Clean up temp directory
    Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host ""
    Write-Success "🎉 Installation completed!"
    Write-Host ""
    Write-Status "Next steps:"
    Write-Host "1. Close and reopen PowerShell/Command Prompt"
    Write-Host "2. Setup PostgreSQL database (if not done automatically)"
    Write-Host "3. Run: .\start-enfor-data.ps1"
    Write-Host ""
    
    # Database setup instructions
    Write-Status "📊 Database Setup:"
    Write-Host "If PostgreSQL was installed, you may need to setup the database:"
    Write-Host ""
    Write-Host "1. Open pgAdmin or Command Prompt"
    Write-Host "2. Run: psql -U postgres -h localhost"
    Write-Host "3. Enter password: enfor_data"
    Write-Host "4. Execute these commands:"
    Write-Host "   CREATE DATABASE enfor_data;"
    Write-Host "   CREATE USER backend WITH PASSWORD 'enfor_data';"
    Write-Host "   GRANT ALL PRIVILEGES ON DATABASE enfor_data TO backend;"
    Write-Host ""
    
    Write-Status "Installation log saved to: $env:TEMP\enfor-installer.log"
}

# Run installation
try {
    Install-Prerequisites
}
catch {
    Write-Error "Installation failed: $($_.Exception.Message)"
    exit 1
}