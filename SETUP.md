# 🚀 Gold & Silver Dashboard - Setup Guide

## ⚡ Quick Start (Recommended)

### For Unix/Linux/macOS:
```bash
# 1. Clone the repository
git clone https://github.com/abdulrahmanka/gold-silver-dashboard.git
cd gold-silver-dashboard

# 2. Run automated installation
chmod +x install.sh
./install.sh

# 3. Start the application
./run.sh
```

### For Windows:
```cmd
# 1. Clone the repository
git clone https://github.com/abdulrahmanka/gold-silver-dashboard.git
cd gold-silver-dashboard

# 2. Run automated installation
install.bat

# 3. Start the application
run.bat
```

## 🎉 That's it! 

Your Gold & Silver Dashboard will be running at:
- 📊 **Dashboard**: http://localhost:3000
- 🔗 **API**: http://localhost:3001/api/dashboard
- 📋 **API Health**: http://localhost:3001/api/health

## 📋 Prerequisites

### Required Software:
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (optional but recommended)

### System Requirements:
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 500MB for dependencies
- **Network**: Internet connection for MCX data scraping

## 🛠️ Manual Installation (Alternative)

If you prefer manual setup or the automated scripts don't work:

### 1. Install Backend Dependencies
```bash
cd backend
npm install
npx playwright install chromium
```

### 2. Install Frontend Dependencies  
```bash
cd ../frontend
npm install
```

### 3. Setup Environment Files
```bash
# Copy example environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 4. Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

### 5. Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

## 🎯 Script Options

### Installation Scripts:
- `install.sh` / `install.bat` - Full automated setup
- Checks Node.js version compatibility
- Installs all dependencies
- Sets up environment files
- Installs Playwright browsers
- Creates necessary directories

### Run Scripts:
- `run.sh` / `run.bat` - Start both servers
- `./run.sh --prod` - Production mode
- `./run.sh --no-browser` - Don't auto-open browser
- `./run.sh --help` - Show all options

## 📱 Features You'll See

### Live Data Dashboard:
- **Gold Prices** (₹/10g) with daily change
- **Silver Prices** (₹/kg) with daily change  
- **GSR Ratio** (Gold-Silver Ratio) prominently displayed
- **Auto-refresh** every minute
- **Professional UI** with enhanced styling
- **Responsive design** for mobile/desktop

### Real-time Features:
- MCX India data scraping every minute
- SQLite database for price history
- Demo data fallback system
- Status indicators and error handling

## 🔧 Troubleshooting

### Common Issues:

#### ❌ Node.js Version Error
```bash
# Check your Node.js version
node --version

# Should be 16.0.0 or higher
# Update from https://nodejs.org/
```

#### ❌ Playwright Installation Failed
```bash
cd backend
npx playwright install chromium
# or for system-wide:
sudo npx playwright install-deps chromium
```

#### ❌ Port Already in Use
```bash
# Check what's using the ports
lsof -i :3000  # Frontend
lsof -i :3001  # Backend

# Kill existing processes
pkill -f "node.*3000"
pkill -f "node.*3001"
```

#### ❌ CORS Errors
- Check that backend is running on port 3001
- Verify frontend environment variables
- Clear browser cache and restart

#### ❌ MCX Data Not Loading
- Check network connection
- MCX India website may be temporarily down
- App will show demo data as fallback

### Backend Issues:
```bash
# Check API health
curl http://localhost:3001/api/health

# Manual data trigger
curl -X POST http://localhost:3001/api/scheduler/trigger

# View logs
cd backend && npm run dev
```

### Frontend Issues:
```bash
# Clear React cache
cd frontend
rm -rf node_modules/.cache
npm start

# Check for compilation errors
npm run build
```

## 🔐 Configuration

### Backend Environment Variables (`backend/.env`):
```env
NODE_ENV=development
PORT=3001
SCRAPE_INTERVAL_MINUTES=1
DB_PATH=./data/prices.db
```

### Frontend Environment Variables (`frontend/.env`):
```env
REACT_APP_API_BASE_URL=http://localhost:3001
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

## 📊 Testing the Setup

### 1. API Health Check:
```bash
curl http://localhost:3001/api/health
# Should return: {"success": true, "message": "API is running"}
```

### 2. Dashboard Data:
```bash
curl http://localhost:3001/api/dashboard
# Should return gold, silver, and GSR data
```

### 3. Manual Scraper Trigger:
```bash
curl -X POST http://localhost:3001/api/scheduler/trigger
# Should trigger immediate MCX data fetch
```

## 🚀 Production Deployment

For production deployment, see:
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Comprehensive deployment guide
- **[NETLIFY_ALTERNATIVES.md](NETLIFY_ALTERNATIVES.md)** - Platform compatibility analysis

### Quick Production Setup:
```bash
# Backend (Production mode)
cd backend
npm start

# Frontend (Build for production)
cd frontend
npm run build
# Serve build/ folder with web server
```

## 🔄 Development Workflow

### Making Changes:
1. **Backend changes**: Server auto-restarts with nodemon
2. **Frontend changes**: Hot reload in browser
3. **Environment changes**: Restart both servers

### Database:
- SQLite database stored in `backend/data/prices.db`
- Automatically created on first run
- Contains price history and GSR calculations

### Logs:
- Backend logs shown in terminal
- Frontend development server logs
- Browser console for frontend errors

## 📞 Support

### Having Issues?
1. Check this troubleshooting guide
2. Verify Node.js version (16+)
3. Run `./install.sh` or `install.bat` again
4. Check GitHub issues: [Repository Issues](https://github.com/abdulrahmanka/gold-silver-dashboard/issues)

### Performance Tips:
- Close unnecessary browser tabs
- Ensure stable internet connection
- Monitor system resources during scraping
- Consider increasing scrape interval for slower systems

## 🎯 Next Steps

Once your dashboard is running:
1. **Customize** scraping intervals in `backend/.env`
2. **Monitor** MCX data accuracy
3. **Deploy** to production using deployment guides
4. **Share** your dashboard URL with others

Happy trading! 📈💰