import React from 'react';
import { GSRData } from '../types';
import './GSRCard.css';

interface GSRCardProps {
  data: GSRData | null;
  loading: boolean;
}

const GSRCard: React.FC<GSRCardProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="gsr-card loading">
        <div className="gsr-header">
          <h3>Gold-Silver Ratio</h3>
        </div>
        <div className="gsr-content">
          <div className="gsr-main">Loading...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="gsr-card error">
        <div className="gsr-header">
          <h3>Gold-Silver Ratio</h3>
        </div>
        <div className="gsr-content">
          <div className="gsr-main">No data</div>
        </div>
      </div>
    );
  }

  const formatRatio = (ratio: number) => {
    return ratio.toFixed(2);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getGSRInterpretation = (ratio: number) => {
    if (ratio < 50) {
      return { text: 'Silver is relatively expensive', class: 'silver-expensive' };
    } else if (ratio > 80) {
      return { text: 'Gold is relatively expensive', class: 'gold-expensive' };
    } else {
      return { text: 'Ratio in normal range', class: 'normal-range' };
    }
  };

  const interpretation = getGSRInterpretation(data.gsr_ratio);

  return (
    <div className="gsr-card">
      <div className="gsr-header">
        <h3>Gold-Silver Ratio</h3>
        <div className="gsr-tooltip">
          <span className="tooltip-icon">?</span>
          <div className="tooltip-content">
            The Gold-Silver Ratio shows how many ounces of silver equal one ounce of gold.
            <br />• Below 50: Silver relatively expensive
            <br />• Above 80: Gold relatively expensive
            <br />• 50-80: Normal range
          </div>
        </div>
      </div>
      
      <div className="gsr-content">
        <div className="gsr-main">
          <span className="ratio-value">{formatRatio(data.gsr_ratio)}</span>
          <span className="ratio-suffix">:1</span>
        </div>
        
        <div className={`gsr-interpretation ${interpretation.class}`}>
          {interpretation.text}
        </div>
        
        <div className="gsr-calculation">
          <div className="calc-row">
            <span className="calc-label">Gold Price:</span>
            <span className="calc-value">{formatPrice(data.gold_price)}</span>
          </div>
          <div className="calc-divider">÷</div>
          <div className="calc-row">
            <span className="calc-label">Silver Price:</span>
            <span className="calc-value">{formatPrice(data.silver_price)}</span>
          </div>
          <div className="calc-equals">=</div>
          <div className="calc-result">
            {formatRatio(data.gsr_ratio)}
          </div>
        </div>
        
        <div className="gsr-visual">
          <div className="ratio-bar">
            <div className="gold-portion" style={{ width: '60%' }}></div>
            <div className="silver-portion" style={{ width: '40%' }}></div>
          </div>
          <div className="ratio-labels">
            <span>Gold</span>
            <span>Silver</span>
          </div>
        </div>
        
        <div className="gsr-meta">
          <small>Updated: {formatTime(data.timestamp)}</small>
        </div>
      </div>
    </div>
  );
};

export default GSRCard;