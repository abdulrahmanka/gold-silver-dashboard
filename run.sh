#!/bin/bash

# Gold & Silver Dashboard - Run Script for Unix/Linux/macOS
# This script starts both backend and frontend servers concurrently

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_backend() {
    echo -e "${PURPLE}[BACKEND]${NC} $1"
}

print_frontend() {
    echo -e "${CYAN}[FRONTEND]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to cleanup background processes
cleanup() {
    print_status "Shutting down servers..."
    jobs -p | xargs -r kill 2>/dev/null || true
    print_success "Cleanup complete"
    exit 0
}

# Trap signals for cleanup
trap cleanup SIGINT SIGTERM

# Header
echo -e "${GREEN}"
echo "=================================================="
echo "    Gold & Silver Dashboard - Starting Servers"
echo "=================================================="
echo -e "${NC}"

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if ! command_exists node; then
    print_error "Node.js is not installed! Please run ./install.sh first."
    exit 1
fi

# Check npm
if ! command_exists npm; then
    print_error "npm is not installed! Please run ./install.sh first."
    exit 1
fi

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    print_error "Backend dependencies not installed! Please run ./install.sh first."
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    print_error "Frontend dependencies not installed! Please run ./install.sh first."
    exit 1
fi

# Check for environment files
if [ ! -f "backend/.env" ]; then
    print_warning "backend/.env not found! Creating from template..."
    cp backend/.env.example backend/.env
fi

if [ ! -f "frontend/.env" ]; then
    print_warning "frontend/.env not found! Creating from template..."
    cp frontend/.env.example frontend/.env
fi

# Check if ports are already in use
if port_in_use 3001; then
    print_warning "Port 3001 is already in use. Backend may not start properly."
fi

if port_in_use 3000; then
    print_warning "Port 3000 is already in use. Frontend may not start properly."
fi

# Create data directory if it doesn't exist
mkdir -p backend/data

print_success "Prerequisites check complete"
echo ""

# Parse command line arguments
MODE="dev"
OPEN_BROWSER=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --prod|--production)
            MODE="prod"
            shift
            ;;
        --no-browser)
            OPEN_BROWSER=false
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --prod, --production  Run in production mode"
            echo "  --no-browser         Don't open browser automatically"
            echo "  --help, -h           Show this help message"
            echo ""
            echo "Default: Development mode with browser auto-open"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Start backend server
print_backend "Starting backend server on port 3001..."
cd backend
if [ "$MODE" = "prod" ]; then
    npm start &
else
    npm run dev &
fi
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    print_error "Backend server failed to start!"
    exit 1
fi

print_backend "Backend server started successfully (PID: $BACKEND_PID)"

# Start frontend server
print_frontend "Starting frontend server on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 3

# Check if frontend started successfully
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    print_error "Frontend server failed to start!"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

print_frontend "Frontend server started successfully (PID: $FRONTEND_PID)"

echo ""
print_success "Both servers are running!"
echo ""
echo -e "${GREEN}🌐 Access your dashboard at:${NC}"
echo -e "   ${CYAN}Local:${NC}    http://localhost:3000"
echo -e "   ${CYAN}Network:${NC}  http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo -e "${GREEN}📊 Backend API available at:${NC}"
echo -e "   ${CYAN}API:${NC}      http://localhost:3001"
echo -e "   ${CYAN}Health:${NC}   http://localhost:3001/api/health"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "   • Press Ctrl+C to stop both servers"
echo "   • Backend will scrape MCX data every minute"
echo "   • Frontend will auto-refresh data every minute"
echo "   • Check backend/.env and frontend/.env for configuration"
echo ""

# Open browser if requested and available
if [ "$OPEN_BROWSER" = true ]; then
    sleep 2
    if command_exists open; then
        print_status "Opening browser..."
        open http://localhost:3000
    elif command_exists xdg-open; then
        print_status "Opening browser..."
        xdg-open http://localhost:3000
    elif command_exists sensible-browser; then
        print_status "Opening browser..."
        sensible-browser http://localhost:3000
    else
        print_status "Please open http://localhost:3000 in your browser"
    fi
fi

print_status "Servers are running. Press Ctrl+C to stop."

# Wait for processes to complete or be interrupted
wait