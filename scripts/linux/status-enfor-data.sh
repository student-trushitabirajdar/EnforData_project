#!/bin/bash

# ENFOR DATA - Status Check Script
# This script checks the status of both backend and frontend servers

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

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_service() {
    local url=$1
    local name=$2
    
    if curl -s "$url" >/dev/null 2>&1; then
        print_success "$name is running"
        return 0
    else
        print_error "$name is not responding"
        return 1
    fi
}

check_port() {
    local port=$1
    local name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        local pid=$(lsof -ti:$port 2>/dev/null | head -1)
        print_success "$name is running on port $port (PID: $pid)"
        return 0
    else
        print_error "$name is not running on port $port"
        return 1
    fi
}

main() {
    print_status "ENFOR DATA Platform Status Check"
    echo
    
    # Check backend
    echo -e "${BLUE}Backend Server:${NC}"
    check_service "http://localhost:8080/health" "Backend API"
    check_port 8080 "Backend process"
    echo
    
    # Check frontend (try multiple ports)
    echo -e "${BLUE}Frontend Server:${NC}"
    FRONTEND_RUNNING=false
    
    for port in 3000 3001 5173; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            local pid=$(lsof -ti:$port 2>/dev/null | head -1)
            print_success "Frontend is running on port $port (PID: $pid)"
            echo -e "   ${GREEN}🌐 Access at: http://localhost:$port${NC}"
            FRONTEND_RUNNING=true
            break
        fi
    done
    
    if [ "$FRONTEND_RUNNING" = false ]; then
        print_error "Frontend is not running"
    fi
    
    echo
    
    # Check database
    echo -e "${BLUE}Database:${NC}"
    if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
        print_success "PostgreSQL is running"
        
        if psql -h localhost -U backend -d enfor_data -c "SELECT COUNT(*) FROM users;" >/dev/null 2>&1; then
            local user_count=$(psql -h localhost -U backend -d enfor_data -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs)
            print_success "Database connection OK ($user_count users registered)"
        else
            print_error "Cannot connect to enfor_data database"
        fi
    else
        print_error "PostgreSQL is not running"
    fi
    
    echo
    
    # Show process information
    echo -e "${BLUE}Process Information:${NC}"
    
    # Backend processes
    local backend_pids=$(pgrep -f "enfor-backend" 2>/dev/null)
    if [ ! -z "$backend_pids" ]; then
        echo "Backend processes: $backend_pids"
    fi
    
    # Frontend processes
    local frontend_pids=$(pgrep -f "vite" 2>/dev/null)
    if [ ! -z "$frontend_pids" ]; then
        echo "Frontend processes: $frontend_pids"
    fi
    
    # Log files
    echo
    echo -e "${BLUE}Log Files:${NC}"
    if [ -f "backend.log" ]; then
        local backend_size=$(du -h backend.log | cut -f1)
        echo "Backend log: backend.log ($backend_size)"
    fi
    
    if [ -f "frontend.log" ]; then
        local frontend_size=$(du -h frontend.log | cut -f1)
        echo "Frontend log: frontend.log ($frontend_size)"
    fi
    
    echo
    echo -e "${YELLOW}Commands:${NC}"
    echo "  Start:  ./start-enfor-data.sh"
    echo "  Stop:   ./stop-enfor-data.sh"
    echo "  Status: ./status-enfor-data.sh"
}

main "$@"