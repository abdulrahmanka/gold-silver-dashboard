import React from 'react';
import { useDashboard } from './hooks/useDashboard';
import PriceCard from './components/PriceCard';
import GSRCard from './components/GSRCard';
import StatusBar from './components/StatusBar';
import './App.css';

function App() {
  // Auto-refresh every minute (60000ms)
  const { data, loading, error, lastUpdated, isOnline, refresh } = useDashboard(60000);

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="gold-text">Gold</span>
            <span className="separator">&</span>
            <span className="silver-text">Silver</span>
            <span className="subtitle">Price Dashboard</span>
          </h1>
          <p className="app-description">
            Live MCX Gold & Silver prices with GSR tracking
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <StatusBar
            lastUpdated={lastUpdated}
            isOnline={isOnline}
            error={error}
            onRefresh={refresh}
            loading={loading}
          />

          <div className="dashboard-grid">
            <div className="price-cards">
              <PriceCard
                title="Gold"
                data={data?.current.gold || null}
                loading={loading}
                color="gold"
              />
              
              <PriceCard
                title="Silver"
                data={data?.current.silver || null}
                loading={loading}
                color="silver"
              />
            </div>

            <div className="gsr-section">
              <GSRCard
                data={data?.current.gsr || null}
                loading={loading}
              />
            </div>
          </div>

          {data && (
            <div className="market-info">
              <div className="info-grid">
                <div className="info-card">
                  <h4>Market Status</h4>
                  <p className="status-text">
                    {isOnline ? '🟢 Live Data' : '🔴 Offline'}
                  </p>
                  <small>MCX India Trading Hours: 9:00 AM - 11:30 PM</small>
                </div>
                
                <div className="info-card">
                  <h4>Auto Refresh</h4>
                  <p className="status-text">⏱️ Every 1 minute</p>
                  <small>Data updates automatically from MCX India</small>
                </div>
                
                <div className="info-card">
                  <h4>Data Source</h4>
                  <p className="status-text">📊 MCX India</p>
                  <small>Multi Commodity Exchange of India Ltd.</small>
                </div>
              </div>
            </div>
          )}

          {!data && !loading && (
            <div className="empty-state">
              <div className="empty-content">
                <h3>No Data Available</h3>
                <p>Unable to fetch price data from MCX India.</p>
                <button 
                  className="retry-btn"
                  onClick={refresh}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2025 Gold & Silver Dashboard</p>
          <p>
            <small>
              Data sourced from MCX India • 
              Prices are for reference only • 
              Not for trading decisions
            </small>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;