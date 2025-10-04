# 🚀 Setup Instructions

## Quick Start Guide

### 1. Install Backend Dependencies
```bash
cd backend
npm install
npm run install-browsers
```

### 2. Install Frontend Dependencies  
```bash
cd ../frontend
npm install
```

### 3. Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
✅ Backend will start on http://localhost:3001

### 4. Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```
✅ Frontend will start on http://localhost:3000

## 🎉 That's it! 

Your Gold & Silver Dashboard is now running!

- 📊 **Dashboard**: http://localhost:3000
- 🔗 **API**: http://localhost:3001/api/dashboard
- 📋 **API Docs**: http://localhost:3001

## 📱 Features You'll See

- **Live Gold Prices** (₹/10g)
- **Live Silver Prices** (₹/kg)
- **GSR Ratio** with market interpretation
- **Auto-refresh** every minute
- **Responsive design** for mobile/desktop

## 🔧 Troubleshooting

### Backend Issues
```bash
# If browser installation fails
cd backend
npx playwright install chromium

# Check if API is working
curl http://localhost:3001/api/health
```

### Frontend Issues
```bash
# Clear cache and restart
cd frontend
npm start -- --reset-cache
```

### Data Not Loading
- Check if backend is running on port 3001
- Look for CORS errors in browser console
- Verify MCX website is accessible

## 🎯 Testing the Setup

1. **API Health**: Visit http://localhost:3001/api/health
2. **Manual Trigger**: POST to http://localhost:3001/api/scheduler/trigger
3. **Dashboard Data**: Visit http://localhost:3001/api/dashboard

## 📦 Production Deployment

### Backend
```bash
npm run build  # If you add a build step
npm start      # Production mode
```

### Frontend
```bash
npm run build
# Serve the build folder with your web server
```

## 🔐 Environment Variables

Create `.env` files as needed:

**Backend (.env)**:
```env
PORT=3001
SCRAPE_INTERVAL_MINUTES=1
```

**Frontend (.env)**:
```env
REACT_APP_API_URL=http://localhost:3001/api
```