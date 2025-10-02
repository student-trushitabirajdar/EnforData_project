#!/bin/bash

# ENFOR DATA - Stop Script
# This script stops both backend and frontend servers

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[ENFOR DATA]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        print_status "Stopping processes on port $port"
        kill -15 $pids 2>/dev/null || true
        sleep 2
        
        # Force kill if still running
        pids=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pids" ]; then
            kill -9 $pids 2>/dev/null || true
        fi
    fi
}

main() {
    print_status "Stopping ENFOR DATA Platform..."
    echo
    
    # Stop backend server
    if [ -f "backend.pid" ]; then
        BACKEND_PID=$(cat backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            print_status "Stopping backend server (PID: $BACKEND_PID)"
            kill -15 $BACKEND_PID 2>/dev/null || true
            sleep 2
            
            # Force kill if still running
            if kill -0 $BACKEND_PID 2>/dev/null; then
                kill -9 $BACKEND_PID 2>/dev/null || true
            fi
        fi
        rm -f backend.pid
    fi
    
    # Stop frontend server
    if [ -f "frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            print_status "Stopping frontend server (PID: $FRONTEND_PID)"
            kill -15 $FRONTEND_PID 2>/dev/null || true
            sleep 2
            
            # Force kill if still running
            if kill -0 $FRONTEND_PID 2>/dev/null; then
                kill -9 $FRONTEND_PID 2>/dev/null || true
            fi
        fi
        rm -f frontend.pid
    fi
    
    # Kill any remaining processes
    print_status "Cleaning up remaining processes..."
    
    pkill -f "enfor-backend" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    
    # Kill processes on specific ports
    kill_port 8080  # Backend
    kill_port 3000  # Frontend
    kill_port 3001  # Frontend alternative
    kill_port 5173  # Vite default
    
    # Clean up log files (optional)
    if [ -f "backend.log" ] || [ -f "frontend.log" ]; then
        read -p "Delete log files? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -f backend.log frontend.log
            print_success "Log files deleted"
        fi
    fi
    
    print_success "ENFOR DATA Platform stopped successfully"
}

main "$@"