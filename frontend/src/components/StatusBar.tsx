import React from 'react';
import './StatusBar.css';

interface StatusBarProps {
  lastUpdated: Date | null;
  isOnline: boolean;
  error: string | null;
  onRefresh: () => void;
  loading: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  lastUpdated, 
  isOnline, 
  error, 
  onRefresh, 
  loading 
}) => {
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else {
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return 'offline';
    if (error) return 'error';
    if (loading) return 'loading';
    return 'online';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (error) return 'Error';
    if (loading) return 'Updating...';
    return 'Live';
  };

  return (
    <div className="status-bar">
      <div className="status-info">
        <div className={`status-indicator ${getStatusColor()}`}>
          <div className="status-dot"></div>
          <span className="status-text">{getStatusText()}</span>
        </div>
        
        <div className="last-updated">
          <span className="update-label">Last updated:</span>
          <span className="update-time">{formatLastUpdated(lastUpdated)}</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      <div className="status-actions">
        <button 
          className={`refresh-btn ${loading ? 'loading' : ''}`}
          onClick={onRefresh}
          disabled={loading}
          title="Refresh data"
        >
          <span className="refresh-icon">🔄</span>
          <span className="refresh-text">
            {loading ? 'Updating...' : 'Refresh'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default StatusBar;