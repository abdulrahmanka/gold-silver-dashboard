# 🥇 Gold & Silver Price Dashboard

A real-time dashboard for tracking Gold and Silver prices from MCX India with automatic GSR (Gold-Silver Ratio) calculation.

## ✨ Features

- 📊 **Live Price Tracking**: Real-time Gold & Silver prices from MCX India
- 🔄 **Auto Refresh**: Updates every minute automatically
- 📈 **GSR Calculation**: Gold-Silver Ratio with market interpretation
- 🎨 **Beautiful UI**: Modern, responsive design with gradient themes
- 💾 **Data Storage**: SQLite database for price history
- 🌐 **Browser Simulation**: Playwright for reliable data scraping
- 📱 **Mobile Friendly**: Responsive design for all devices

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Web Scraper**: Playwright-based browser automation
- **Database**: SQLite for price history storage
- **API**: RESTful endpoints for dashboard data
- **Scheduler**: Automatic data fetching every minute
- **Error Handling**: Robust retry mechanisms

### Frontend (React + TypeScript)
- **Components**: Modular price cards and GSR display
- **Hooks**: Custom hooks for data management
- **Real-time Updates**: Auto-refreshing dashboard
- **Responsive Design**: Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone and setup backend:**
   ```bash
   cd backend
   npm install
   npm run install-browsers  # Install Playwright browsers
   ```

2. **Setup frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   Backend will start on: http://localhost:3001

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```
   Frontend will start on: http://localhost:3000

## 📱 Dashboard Features

### Price Cards
- **Gold Price**: Live MCX Gold futures (10 GRMS)
- **Silver Price**: Live MCX Silver futures
- **Price Changes**: Absolute and percentage changes
- **OHLC Data**: Open, High, Low, Close prices
- **Volume**: Trading volume information

### GSR Card
- **Ratio Calculation**: Gold Price ÷ Silver Price
- **Market Interpretation**: 
  - Below 50: Silver relatively expensive
  - 50-80: Normal range
  - Above 80: Gold relatively expensive
- **Visual Bar**: Proportional representation

### Status Bar
- **Connection Status**: Live/Offline indicator
- **Last Updated**: Timestamp of latest data
- **Manual Refresh**: Force data update
- **Error Handling**: Connection error messages

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard` | GET | Complete dashboard data |
| `/api/current` | GET | Current Gold & Silver prices |
| `/api/history/:symbol` | GET | Price history for GOLD/SILVER |
| `/api/gsr/history` | GET | GSR ratio history |
| `/api/health` | GET | API health check |
| `/api/scheduler/status` | GET | Scraper status |
| `/api/scheduler/trigger` | POST | Manual scrape trigger |

## ⚙️ Configuration

### Backend Environment (.env)
```env
PORT=3001
NODE_ENV=development
DB_PATH=./data/prices.db
SCRAPE_INTERVAL_MINUTES=1
MCX_URL=https://www.mcxindia.com/backpage.aspx/GetMarketWatch
```

### Frontend Environment
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 📊 Data Flow

1. **Scheduler** triggers scraping every minute
2. **Playwright** navigates to MCX website and fetches data
3. **Parser** extracts Gold/Silver futures data
4. **Database** stores price data and calculates GSR
5. **API** serves data to frontend
6. **Frontend** displays real-time dashboard

## 🛠️ Development

### Backend Scripts
```bash
npm start      # Production mode
npm run dev    # Development with nodemon
```

### Frontend Scripts
```bash
npm start      # Development server
npm run build  # Production build
npm test       # Run tests
```

## 📦 Dependencies

### Backend
- **Express**: Web framework
- **Playwright**: Browser automation
- **SQLite3**: Database
- **node-cron**: Task scheduling
- **CORS**: Cross-origin support

### Frontend
- **React**: UI framework
- **TypeScript**: Type safety
- **Axios**: HTTP client
- **CSS Modules**: Styling

## 🔒 Security Features

- CORS configuration
- Request rate limiting (via intervals)
- Error handling and validation
- Secure browser automation

## 📈 Data Storage

### Prices Table
- Symbol, Price data (OHLC)
- Volume, Open Interest
- Timestamps for tracking

### GSR History Table
- Gold/Silver prices
- Calculated GSR ratio
- Historical tracking

## 🎨 UI Components

- **PriceCard**: Individual metal price display
- **GSRCard**: Ratio calculation and interpretation
- **StatusBar**: Connection and update status
- **Dashboard**: Main layout container

## 🔄 Auto-Refresh Logic

- **Frontend**: 60-second interval using React hooks
- **Backend**: 1-minute cron job for data scraping
- **Error Recovery**: Automatic retry on failures
- **Offline Handling**: Graceful degradation

## 📱 Responsive Design

- **Desktop**: Three-column layout
- **Tablet**: Two-column layout
- **Mobile**: Single-column stack
- **Accessibility**: High contrast support

## 🚨 Error Handling

- **Network Errors**: Retry mechanisms
- **Data Validation**: Schema checking
- **UI Feedback**: Error states and loading indicators
- **Graceful Degradation**: Offline functionality

## 📊 Performance

- **Efficient Updates**: Only fetch when needed
- **Caching**: Smart data caching strategies
- **Lightweight**: Minimal bundle size
- **Fast Loading**: Optimized components

## 🔮 Future Enhancements

- Historical price charts
- Price alerts and notifications
- Additional metals (Copper, etc.)
- Export functionality
- Advanced analytics

---

**Disclaimer**: This application is for informational purposes only. Prices are sourced from MCX India and should not be used for actual trading decisions. Always consult official sources for trading.