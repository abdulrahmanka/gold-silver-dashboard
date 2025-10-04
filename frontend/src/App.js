import React, { useState, useEffect } from 'react';
import './App.css';

// Simple demo dashboard without external dependencies for now
function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.data);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto-refresh every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change, percent) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
  };

  const getChangeClass = (change) => {
    return change >= 0 ? 'positive' : 'negative';
  };

  if (loading && !data) {
    return (
      <div className="App">
        <header className="app-header">
          <h1>🥇 Gold & Silver Dashboard</h1>
          <p>Loading live MCX prices...</p>
        </header>
      </div>
    );
  }

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
          {/* Status Bar */}
          <div className="status-bar">
            <div className="status-info">
              <div className={`status-indicator ${error ? 'error' : 'online'}`}>
                <div className="status-dot"></div>
                <span className="status-text">{error ? 'Error' : 'Live'}</span>
              </div>
              <div className="last-updated">
                <span>Last updated: </span>
                <span>{lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}</span>
              </div>
            </div>
            <button 
              className="refresh-btn"
              onClick={() => window.location.reload()}
            >
              🔄 Refresh
            </button>
          </div>

          {error && (
            <div className="error-message">
              <h3>⚠️ Connection Error</h3>
              <p>{error}</p>
              <p>The backend API might not be running on port 3001.</p>
            </div>
          )}

          {data && (
            <div className="dashboard-grid">
              {/* Gold Price Card */}
              <div className="price-card gold">
                <div className="price-card-header">
                  <h3>GOLD</h3>
                  <span className="unit">{data.current.gold?.unit || '10 GRMS'}</span>
                </div>
                <div className="price-card-content">
                  <div className="price-main">
                    {data.current.gold ? formatPrice(data.current.gold.ltp) : 'N/A'}
                  </div>
                  {data.current.gold && (
                    <div className={`price-change ${getChangeClass(data.current.gold.absolute_change)}`}>
                      {formatChange(data.current.gold.absolute_change, data.current.gold.percent_change)}
                    </div>
                  )}
                </div>
              </div>

              {/* Silver Price Card */}
              <div className="price-card silver">
                <div className="price-card-header">
                  <h3>{data.current.silver?.symbol === 'SILVERMIC' ? 'SILVER (MIC)' : 'SILVER'}</h3>
                  <span className="unit">{data.current.silver?.unit || '1 KGS'}</span>
                </div>
                <div className="price-card-content">
                  <div className="price-main">
                    {data.current.silver ? formatPrice(data.current.silver.ltp) : 'N/A'}
                  </div>
                  {data.current.silver && (
                    <div className={`price-change ${getChangeClass(data.current.silver.absolute_change)}`}>
                      {formatChange(data.current.silver.absolute_change, data.current.silver.percent_change)}
                    </div>
                  )}
                </div>
              </div>

              {/* GSR Card */}
              <div className="gsr-card">
                <div className="gsr-header">
                  <h3>Gold-Silver Ratio</h3>
                </div>
                <div className="gsr-content">
                  <div className="gsr-main">
                    <span className="ratio-value">
                      {data.current.gsr ? data.current.gsr.gsr_ratio.toFixed(2) : 'N/A'}
                    </span>
                    <span className="ratio-suffix">:1</span>
                  </div>
                  {data.current.gsr && (
                    <div className="gsr-calculation">
                      <div>Gold: {formatPrice(data.current.gsr.gold_price)}</div>
                      <div>÷</div>
                      <div>Silver: {formatPrice(data.current.gsr.silver_price)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!data && !loading && !error && (
            <div className="empty-state">
              <h3>No Data Available</h3>
              <p>Unable to fetch price data from MCX India.</p>
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