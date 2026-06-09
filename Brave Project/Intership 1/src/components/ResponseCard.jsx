import React, { useState } from 'react';
import './ResponseCard.css';

export default function ResponseCard({ question, response, timestamp, onClear }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy response text: ', err);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="response-card-wrapper animate-fade-in">
      <div className="response-card glass-card">
        {question && (
          <div className="user-query-container">
            <div className="user-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="query-content">
              <span className="query-label">You Asked</span>
              <p className="query-text">{question}</p>
            </div>
          </div>
        )}

        <div className="ai-response-container">
          <div className="ai-card-header">
            <div className="ai-branding">
              <span className="ai-avatar-pulse">
                <span className="pulse-core"></span>
              </span>
              <span className="ai-label">AI Travel Assistant</span>
            </div>
            {timestamp && <span className="response-time">{formatTime(timestamp)}</span>}
          </div>

          <div className="response-content-body">
            {response.split('\n').map((paragraph, index) => {
              if (!paragraph.trim()) return <div key={index} className="response-space"></div>;
              
              // Support bold tokens (**text**) in text paragraphs
              const parts = paragraph.split(/(\*\*.*?\*\*)/g);
              const formattedText = parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                return part;
              });

              return <p key={index} className="response-paragraph">{formattedText}</p>;
            })}
          </div>
        </div>

        <div className="response-actions-row">
          <button
            type="button"
            className="btn btn-secondary btn-action-clear"
            onClick={onClear}
            title="Clear chatbot session"
          >
            <svg
              className="action-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Clear Chat
          </button>

          <button
            type="button"
            className={`btn ${copied ? 'btn-copied' : 'btn-primary'} btn-action-copy`}
            onClick={handleCopy}
            title="Copy answer to clipboard"
          >
            {copied ? (
              <>
                <svg
                  className="action-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg
                  className="action-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copy Response</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
