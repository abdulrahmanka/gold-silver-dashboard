import React from 'react';
import { PriceData } from '../types';
import './PriceCard.css';

interface PriceCardProps {
  title: string;
  data: PriceData | null;
  loading: boolean;
  color: 'gold' | 'silver';
}

const PriceCard: React.FC<PriceCardProps> = ({ title, data, loading, color }) => {
  if (loading) {
    return (
      <div className={`price-card ${color} loading`}>
        <div className="price-card-header">
          <h3>{title}</h3>
        </div>
        <div className="price-card-content">
          <div className="price-main">Loading...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`price-card ${color} error`}>
        <div className="price-card-header">
          <h3>{title}</h3>
        </div>
        <div className="price-card-content">
          <div className="price-main">No data</div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change: number, percent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
  };

  const getChangeClass = (change: number) => {
    return change >= 0 ? 'positive' : 'negative';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`price-card ${color}`}>
      <div className="price-card-header">
        <h3>{title}</h3>
        <span className="unit">{data.unit}</span>
      </div>
      
      <div className="price-card-content">
        <div className="price-main">
          {formatPrice(data.ltp)}
        </div>
        
        <div className={`price-change ${getChangeClass(data.absolute_change)}`}>
          {formatChange(data.absolute_change, data.percent_change)}
        </div>
        
        <div className="price-details">
          <div className="price-row">
            <span>Open:</span>
            <span>{formatPrice(data.open)}</span>
          </div>
          <div className="price-row">
            <span>High:</span>
            <span>{formatPrice(data.high)}</span>
          </div>
          <div className="price-row">
            <span>Low:</span>
            <span>{formatPrice(data.low)}</span>
          </div>
          <div className="price-row">
            <span>Volume:</span>
            <span>{data.volume?.toLocaleString() || 'N/A'}</span>
          </div>
        </div>
        
        <div className="price-meta">
          <small>
            Expiry: {data.expiry_date} | Updated: {formatTime(data.timestamp)}
          </small>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;