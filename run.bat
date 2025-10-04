@echo off
REM Gold & Silver Dashboard - Run Script for Windows
REM This script starts both backend and frontend servers concurrently

setlocal enabledelayedexpansion

REM Check for command line arguments
set MODE=dev
set OPEN_BROWSER=true

:parse_args
if "%~1"=="" goto start_servers
if "%~1"=="--prod" set MODE=prod
if "%~1"=="--production" set MODE=prod
if "%~1"=="--no-browser" set OPEN_BROWSER=false
if "%~1"=="--help" goto show_help
if "%~1"=="-h" goto show_help
shift
goto parse_args

:show_help
echo Usage: %~nx0 [options]
echo.
echo Options:
echo   --prod, --production  Run in production mode
echo   --no-browser         Don't open browser automatically
echo   --help, -h           Show this help message
echo.
echo Default: Development mode with browser auto-open
goto end

:start_servers
REM Header
echo.
echo ==================================================
echo     Gold ^& Silver Dashboard - Starting Servers
echo ==================================================
echo.

REM Check prerequisites
echo [INFO] Checking prerequisites...

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed! Please run install.bat first.
    pause
    exit /b 1
)

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed! Please run install.bat first.
    pause
    exit /b 1
)

REM Check if node_modules exist
if not exist "backend\node_modules" (
    echo [ERROR] Backend dependencies not installed! Please run install.bat first.
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo [ERROR] Frontend dependencies not installed! Please run install.bat first.
    pause
    exit /b 1
)

REM Check for environment files
if not exist "backend\.env" (
    echo [WARNING] backend\.env not found! Creating from template...
    copy "backend\.env.example" "backend\.env" >nul
)

if not exist "frontend\.env" (
    echo [WARNING] frontend\.env not found! Creating from template...
    copy "frontend\.env.example" "frontend\.env" >nul
)

REM Create data directory if it doesn't exist
if not exist "backend\data" mkdir "backend\data"

echo [SUCCESS] Prerequisites check complete
echo.

REM Check for existing processes on ports (basic check)
netstat -an | find "LISTENING" | find ":3001" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Port 3001 appears to be in use. Backend may not start properly.
)

netstat -an | find "LISTENING" | find ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Port 3000 appears to be in use. Frontend may not start properly.
)

REM Start backend server
echo [BACKEND] Starting backend server on port 3001...
cd backend
if "%MODE%"=="prod" (
    start "Gold-Silver-Backend" cmd /c "npm start"
) else (
    start "Gold-Silver-Backend" cmd /c "npm run dev"
)
cd ..

REM Wait for backend to start
echo [INFO] Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

REM Start frontend server
echo [FRONTEND] Starting frontend server on port 3000...
cd frontend
start "Gold-Silver-Frontend" cmd /c "npm start"
cd ..

REM Wait for frontend to start
echo [INFO] Waiting for frontend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [SUCCESS] Both servers are starting!
echo.
echo 🌐 Access your dashboard at:
echo    Local:    http://localhost:3000
echo    Network:  http://%COMPUTERNAME%:3000
echo.
echo 📊 Backend API available at:
echo    API:      http://localhost:3001
echo    Health:   http://localhost:3001/api/health
echo.
echo 💡 Tips:
echo    • Two separate command windows will open for backend and frontend
echo    • Close both windows or press Ctrl+C in each to stop servers
echo    • Backend will scrape MCX data every minute
echo    • Frontend will auto-refresh data every minute
echo    • Check backend\.env and frontend\.env for configuration
echo.

REM Open browser if requested
if "%OPEN_BROWSER%"=="true" (
    echo [INFO] Opening browser...
    timeout /t 3 /nobreak >nul
    start http://localhost:3000
)

echo [INFO] Servers are running in separate windows.
echo [INFO] To stop servers, close the backend and frontend command windows.
echo.
pause

:end