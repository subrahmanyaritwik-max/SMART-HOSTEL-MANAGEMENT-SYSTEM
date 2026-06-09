import React from 'react';
import './AnalyticsCard.css';

export default function AnalyticsCard({ title, value, subtitle, icon, variant = 'blue' }) {
  return (
    <div className={`analytics-card glass-card variant-${variant} animate-fade-in`}>
      <div className="analytics-card-content">
        <div className="analytics-text-group">
          <span className="analytics-card-title">{title}</span>
          <h2 className="analytics-card-value">{value}</h2>
          {subtitle && <p className="analytics-card-subtitle">{subtitle}</p>}
        </div>
        <div className="analytics-icon-wrapper">
          {icon}
        </div>
      </div>
    </div>
  );
}
