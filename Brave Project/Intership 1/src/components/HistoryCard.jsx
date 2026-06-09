import React, { useState } from 'react';
import './HistoryCard.css';

export default function HistoryCard({ record, onDelete }) {
  const { id, question, response, timestamp } = record;
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatDateTime = (ts) => {
    if (!ts) return { date: 'N/A', time: 'N/A' };
    try {
      const dateObj = new Date(ts);
      const date = dateObj.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const time = dateObj.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      return { date, time };
    } catch (e) {
      return { date: 'N/A', time: 'N/A' };
    }
  };

  const { date, time } = formatDateTime(timestamp);

  return (
    <div className="history-card glass-card animate-fade-in">
      <div className="history-card-header">
        <div className="history-user-info">
          <span className="history-q-prefix">Q:</span>
          <h3 className="history-question-text">{question}</h3>
        </div>
      </div>

      <div className="history-card-body">
        <div className="history-response-content">
          {response.split('\n').map((paragraph, idx) => {
            if (!paragraph.trim()) return <div key={idx} className="response-space"></div>;
            
            const parts = paragraph.split(/(\*\*.*?\*\*)/g);
            const formatted = parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
              }
              return part;
            });
            return <p key={idx} className="history-p">{formatted}</p>;
          })}
        </div>
      </div>

      <div className="history-card-footer">
        <div className="history-timestamp-container">
          <div className="history-timestamp-item" title="Date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="footer-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{date}</span>
          </div>
          <div className="history-timestamp-item" title="Time">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="footer-icon">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{time}</span>
          </div>
        </div>

        <div className="history-card-actions">
          <button
            onClick={handleCopy}
            className={`btn-history-icon ${copied ? 'copied' : ''}`}
            title="Copy response"
            aria-label="Copy response text"
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-svg">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-svg">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
          
          <button
            onClick={() => onDelete(id)}
            className="btn-history-icon btn-history-delete"
            title="Delete this record"
            aria-label="Delete this history record"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-svg">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
