#!/bin/bash

# Gold & Silver Dashboard - Installation Script for Unix/Linux/macOS
# This script installs all dependencies and sets up the development environment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Header
echo -e "${BLUE}"
echo "=================================================="
echo "  Gold & Silver Dashboard - Installation Script"
echo "=================================================="
echo -e "${NC}"

# Check for Node.js
print_status "Checking Node.js installation..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
    
    # Check if version is >= 16
    NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR_VERSION" -lt 16 ]; then
        print_error "Node.js version 16 or higher is required. Current version: $NODE_VERSION"
        print_status "Please update Node.js: https://nodejs.org/"
        exit 1
    fi
else
    print_error "Node.js is not installed!"
    print_status "Please install Node.js 16+ from: https://nodejs.org/"
    exit 1
fi

# Check for npm
print_status "Checking npm installation..."
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
else
    print_error "npm is not installed!"
    exit 1
fi

# Check for git (optional but recommended)
print_status "Checking git installation..."
if command_exists git; then
    GIT_VERSION=$(git --version)
    print_success "git found: $GIT_VERSION"
else
    print_warning "git is not installed. Some features may not work properly."
fi

# Create .env files if they don't exist
print_status "Setting up environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    print_status "Creating backend/.env file..."
    cp backend/.env.example backend/.env
    print_success "Created backend/.env from template"
else
    print_status "backend/.env already exists"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    print_status "Creating frontend/.env file..."
    cp frontend/.env.example frontend/.env
    print_success "Created frontend/.env from template"
else
    print_status "frontend/.env already exists"
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Install Playwright browsers
print_status "Installing Playwright browsers (this may take a few minutes)..."
npx playwright install chromium
if [ $? -eq 0 ]; then
    print_success "Playwright browsers installed successfully"
else
    print_warning "Failed to install Playwright browsers. Web scraping may not work."
fi

cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Create data directory for SQLite database
print_status "Creating data directory..."
mkdir -p backend/data
print_success "Data directory created"

# Make run script executable
print_status "Making run script executable..."
chmod +x run.sh
print_success "Run script is now executable"

# Installation complete
echo -e "${GREEN}"
echo "=================================================="
echo "          Installation Complete! 🎉"
echo "=================================================="
echo -e "${NC}"

print_success "All dependencies have been installed successfully!"
echo ""
print_status "Next steps:"
echo "  1. Review environment variables in backend/.env and frontend/.env"
echo "  2. Run the application using: ./run.sh"
echo "  3. Access the dashboard at: http://localhost:3000"
echo ""
print_status "For deployment options, see DEPLOYMENT.md"
print_status "For troubleshooting, see SETUP.md"
echo ""
echo -e "${BLUE}Happy trading! 📈💰${NC}"