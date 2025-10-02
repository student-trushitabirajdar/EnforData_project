#!/bin/bash

# ENFOR DATA - Complete Startup Script
# This script starts both backend and frontend servers

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[ENFOR DATA]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill processes on specific ports
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        print_warning "Killing existing processes on port $port"
        kill -9 $pids 2>/dev/null || true
        sleep 2
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start within $max_attempts seconds"
    return 1
}

# Main startup function
main() {
    print_status "Starting ENFOR DATA Platform..."
    echo
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
        print_error "Please run this script from the ENFOR DATA project root directory"
        exit 1
    fi
    
    # Step 1: Check Prerequisites
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    print_success "Node.js found: $(node --version)"
    
    # Check Go
    if ! command -v go &> /dev/null; then
        print_error "Go is not installed. Please install Go first."
        exit 1
    fi
    print_success "Go found: $(go version | cut -d' ' -f3)"
    
    # Check PostgreSQL
    if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
        print_error "PostgreSQL is not running. Please start PostgreSQL first."
        print_status "You can start PostgreSQL with: sudo systemctl start postgresql"
        exit 1
    fi
    print_success "PostgreSQL is running"
    
    # Test database connection
    if ! psql -h localhost -U backend -d enfor_data -c "SELECT 1;" >/dev/null 2>&1; then
        print_error "Cannot connect to enfor_data database."
        print_status "Please ensure the database exists and credentials are correct."
        exit 1
    fi
    print_success "Database connection verified"
    
    echo
    
    # Step 2: Install Dependencies
    print_status "Installing frontend dependencies..."
    if ! npm install --silent; then
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    print_success "Frontend dependencies installed"
    
    print_status "Installing backend dependencies..."
    cd backend
    if ! go mod tidy; then
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    print_success "Backend dependencies installed"
    cd ..
    
    echo
    
    # Step 3: Build Backend
    print_status "Building backend server..."
    cd backend
    if ! go build -o enfor-backend cmd/server/main.go; then
        print_error "Failed to build backend server"
        exit 1
    fi
    print_success "Backend server built successfully"
    cd ..
    
    echo
    
    # Step 4: Clean up existing processes
    print_status "Cleaning up existing processes..."
    
    # Kill existing backend processes
    pkill -f "enfor-backend" 2>/dev/null || true
    kill_port 8080
    
    # Kill existing frontend processes
    pkill -f "vite" 2>/dev/null || true
    kill_port 3000
    kill_port 3001
    kill_port 5173
    
    sleep 2
    print_success "Cleanup completed"
    
    echo
    
    # Step 5: Start Backend Server
    print_status "Starting backend server..."
    cd backend
    
    # Start backend in background
    nohup ./enfor-backend > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    
    cd ..
    
    # Wait for backend to be ready
    if wait_for_service "http://localhost:8080/health" "Backend server"; then
        print_success "Backend server started successfully (PID: $BACKEND_PID)"
    else
        print_error "Backend server failed to start"
        cat backend.log
        exit 1
    fi
    
    echo
    
    # Step 6: Start Frontend Server
    print_status "Starting frontend development server..."
    
    # Start frontend in background
    nohup npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > frontend.pid
    
    # Wait for frontend to be ready (try multiple ports)
    FRONTEND_URL=""
    for port in 3000 3001 5173; do
        sleep 3
        if check_port $port; then
            FRONTEND_URL="http://localhost:$port"
            break
        fi
    done
    
    if [ ! -z "$FRONTEND_URL" ]; then
        print_success "Frontend server started successfully (PID: $FRONTEND_PID)"
    else
        print_error "Frontend server failed to start"
        cat frontend.log
        exit 1
    fi
    
    echo
    
    # Step 7: Display Status
    print_status "🎉 ENFOR DATA Platform is now running!"
    echo
    echo -e "${GREEN}📊 Backend API:${NC}     http://localhost:8080"
    echo -e "${GREEN}🌐 Frontend Web:${NC}    $FRONTEND_URL"
    echo
    echo -e "${BLUE}📋 Demo Login Credentials:${NC}"
    echo "   Broker:          broker@example.com / password123"
    echo "   Channel Partner: builder@example.com / password123"
    echo "   Admin:           admin@example.com / password123"
    echo
    echo -e "${YELLOW}📝 Logs:${NC}"
    echo "   Backend:  tail -f backend.log"
    echo "   Frontend: tail -f frontend.log"
    echo
    echo -e "${YELLOW}🛑 To stop servers:${NC}"
    echo "   ./stop-enfor-data.sh"
    echo
    
    # Open browser (optional)
    if command -v xdg-open &> /dev/null; then
        read -p "Open website in browser? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            xdg-open "$FRONTEND_URL"
        fi
    fi
}

# Trap to handle script interruption
trap 'print_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"