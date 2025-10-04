@echo off
REM Gold & Silver Dashboard - Installation Script for Windows
REM This script installs all dependencies and sets up the development environment

setlocal enabledelayedexpansion

REM Colors (limited support in Windows CMD)
echo.
echo ==================================================
echo   Gold ^& Silver Dashboard - Installation Script
echo ==================================================
echo.

REM Check for Node.js
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo [INFO] Please install Node.js 16+ from: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [SUCCESS] Node.js found: !NODE_VERSION!
    
    REM Extract major version number
    for /f "tokens=1 delims=." %%a in ("!NODE_VERSION:~1!") do set NODE_MAJOR=%%a
    if !NODE_MAJOR! lss 16 (
        echo [ERROR] Node.js version 16 or higher is required. Current version: !NODE_VERSION!
        echo [INFO] Please update Node.js: https://nodejs.org/
        pause
        exit /b 1
    )
)

REM Check for npm
echo [INFO] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [SUCCESS] npm found: !NPM_VERSION!
)

REM Check for git (optional)
echo [INFO] Checking git installation...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] git is not installed. Some features may not work properly.
) else (
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    echo [SUCCESS] git found: !GIT_VERSION!
)

REM Create .env files if they don't exist
echo [INFO] Setting up environment files...

REM Backend .env
if not exist "backend\.env" (
    echo [INFO] Creating backend\.env file...
    copy "backend\.env.example" "backend\.env" >nul
    if %errorlevel% equ 0 (
        echo [SUCCESS] Created backend\.env from template
    ) else (
        echo [WARNING] Could not create backend\.env file
    )
) else (
    echo [INFO] backend\.env already exists
)

REM Frontend .env
if not exist "frontend\.env" (
    echo [INFO] Creating frontend\.env file...
    copy "frontend\.env.example" "frontend\.env" >nul
    if %errorlevel% equ 0 (
        echo [SUCCESS] Created frontend\.env from template
    ) else (
        echo [WARNING] Could not create frontend\.env file
    )
) else (
    echo [INFO] frontend\.env already exists
)

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed successfully

REM Install Playwright browsers
echo [INFO] Installing Playwright browsers (this may take a few minutes)...
call npx playwright install chromium
if %errorlevel% neq 0 (
    echo [WARNING] Failed to install Playwright browsers. Web scraping may not work.
) else (
    echo [SUCCESS] Playwright browsers installed successfully
)

cd ..

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed successfully

cd ..

REM Create data directory for SQLite database
echo [INFO] Creating data directory...
if not exist "backend\data" mkdir "backend\data"
echo [SUCCESS] Data directory created

REM Installation complete
echo.
echo ==================================================
echo           Installation Complete! 🎉
echo ==================================================
echo.

echo [SUCCESS] All dependencies have been installed successfully!
echo.
echo [INFO] Next steps:
echo   1. Review environment variables in backend\.env and frontend\.env
echo   2. Run the application using: run.bat
echo   3. Access the dashboard at: http://localhost:3000
echo.
echo [INFO] For deployment options, see DEPLOYMENT.md
echo [INFO] For troubleshooting, see SETUP.md
echo.
echo Happy trading! 📈💰
echo.
pause