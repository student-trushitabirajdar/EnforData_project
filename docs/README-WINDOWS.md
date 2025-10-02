# ENFOR DATA - Windows Setup Guide

## 🚀 Quick Start for Windows

### Option 1: Automatic Setup (Recommended)
```powershell
# Run PowerShell as Administrator
.\start-enfor-data.ps1 -Setup
```

### Option 2: Simple Batch File
```cmd
# Double-click or run in Command Prompt
start-enfor-data.bat
```

### Option 3: Check What's Missing First
```cmd
# Double-click to see what needs to be installed
setup-windows.bat
```

## 📋 Prerequisites

Your friend needs these installed on Windows:

### Required Software:
1. **Node.js** (v16+) - https://nodejs.org/
2. **Go** (v1.19+) - https://golang.org/dl/
3. **PostgreSQL** (v12+) - https://www.postgresql.org/download/windows/
4. **PowerShell** (usually pre-installed on Windows 10/11)

### Optional but Recommended:
- **Git** - https://git-scm.com/download/win
- **Visual Studio Code** - https://code.visualstudio.com/

## 🛠 Manual Installation Steps

If automatic setup doesn't work, follow these steps:

### 1. Install Node.js
- Download from https://nodejs.org/
- Choose LTS version
- Run installer with default settings
- Verify: Open Command Prompt and run `node --version`

### 2. Install Go
- Download from https://golang.org/dl/
- Choose Windows installer
- Run with default settings
- Verify: Run `go version` in Command Prompt

### 3. Install PostgreSQL
- Download from https://www.postgresql.org/download/windows/
- During installation:
  - Set password to: `enfor_data`
  - Port: `5432` (default)
  - Install all components including pgAdmin
- Verify: Run `psql --version`

### 4. Setup Database
After PostgreSQL installation:

**Option A: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Connect to PostgreSQL server
3. Right-click "Databases" → Create → Database
4. Name: `enfor_data`
5. Go to Query Tool and run:
```sql
CREATE USER backend WITH PASSWORD 'enfor_data';
GRANT ALL PRIVILEGES ON DATABASE enfor_data TO backend;
```

**Option B: Using Command Line**
```cmd
# Open Command Prompt as Administrator
psql -U postgres -h localhost
# Enter password: enfor_data

# Then run these SQL commands:
CREATE DATABASE enfor_data;
CREATE USER backend WITH PASSWORD 'enfor_data';
GRANT ALL PRIVILEGES ON DATABASE enfor_data TO backend;
\q
```

## 🚀 Starting the Website

### Method 1: PowerShell (Recommended)
```powershell
# Open PowerShell in project folder
.\start-enfor-data.ps1
```

### Method 2: Batch File
```cmd
# Double-click or run in Command Prompt
start-enfor-data.bat
```

### Method 3: Manual Commands
```cmd
# Terminal 1: Start Backend
cd backend
go build -o enfor-backend.exe cmd/server/main.go
enfor-backend.exe

# Terminal 2: Start Frontend
npm install
npm run dev
```

## 🌐 Access the Website

Once started, open your browser and go to:
- **Website**: http://localhost:3000 (or 3001/5173)
- **Backend API**: http://localhost:8080

## 👤 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Broker | `broker@example.com` | `password123` |
| Channel Partner | `builder@example.com` | `password123` |
| Admin | `admin@example.com` | `password123` |

## 🛑 Stopping the Website

### PowerShell:
```powershell
.\stop-enfor-data.ps1
```

### Manual:
- Press `Ctrl+C` in both terminal windows
- Or close the terminal windows

## 📊 Check Status

```powershell
.\status-enfor-data.ps1
```

## 🔧 Troubleshooting

### Common Issues:

**"PowerShell execution policy error"**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**"Port already in use"**
- Close other applications using ports 3000, 8080
- Or restart your computer

**"Database connection failed"**
- Make sure PostgreSQL service is running
- Check Windows Services: `services.msc`
- Look for "postgresql-x64-13" or similar
- Start the service if stopped

**"Go/Node not found"**
- Restart Command Prompt/PowerShell after installation
- Check Windows PATH environment variable
- Reinstall with "Add to PATH" option checked

### Getting Help:

1. Run `setup-windows.bat` to see what's missing
2. Check log files: `backend.log`, `frontend.log`
3. Run `status-enfor-data.ps1` to see current status

## 📁 Project Structure

```
EnforData_project/
├── start-enfor-data.ps1    # Main startup script
├── start-enfor-data.bat    # Batch file alternative
├── stop-enfor-data.ps1     # Stop script
├── status-enfor-data.ps1   # Status checker
├── setup-windows.bat       # Setup helper
├── README-WINDOWS.md       # This file
├── backend/                # Go backend server
├── src/                    # React frontend
└── package.json           # Frontend dependencies
```

## 🎯 Development Workflow

1. **First Time Setup**: Run `setup-windows.bat` to check prerequisites
2. **Daily Development**: Use `start-enfor-data.bat` to start everything
3. **Check Status**: Use `status-enfor-data.ps1` if something seems wrong
4. **Stop Everything**: Use `stop-enfor-data.ps1` when done

## 💡 Tips for Windows Development

- Use **Windows Terminal** or **PowerShell** for better experience
- Install **Visual Studio Code** for code editing
- Use **Git Bash** if you prefer Unix-like commands
- Consider **WSL2** for Linux-like development environment

---

**Happy coding on Windows! 🚀**