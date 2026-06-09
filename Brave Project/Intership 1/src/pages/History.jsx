import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HistoryCard from '../components/HistoryCard';
import { getChatHistory, deleteChatHistory, clearHistory } from '../utils/historyStorage';
import './History.css';

export default function History() {
  const [historyList, setHistoryList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getChatHistory();
    setHistoryList(data);
  };

  const handleDeleteItem = (id) => {
    const success = deleteChatHistory(id);
    if (success) {
      loadHistory();
    }
  };

  const handleClearAll = () => {
    const success = clearHistory();
    if (success) {
      loadHistory();
      setShowConfirmClear(false);
    }
  };

  // Filter and Sort history records
  const filteredHistory = historyList
    .filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.question.toLowerCase().includes(query) ||
        item.response.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="history-page-wrapper container">
      {/* Page Header */}
      <header className="page-header animate-fade-in">
        <div className="header-info">
          <h1 className="page-title">Conversation History</h1>
          <p className="page-subtitle">Search and manage your previous chatbot conversations.</p>
        </div>
        
        {historyList.length > 0 && (
          <div className="header-actions">
            {!showConfirmClear ? (
              <button
                type="button"
                className="btn btn-danger btn-clear-all"
                onClick={() => setShowConfirmClear(true)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="btn-icon-svg">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Clear Entire History
              </button>
            ) : (
              <div className="confirm-clear-group glass-card animate-fade-in">
                <span className="confirm-text">Are you sure?</span>
                <button
                  type="button"
                  className="btn btn-danger btn-confirm-yes"
                  onClick={handleClearAll}
                >
                  Yes, Clear
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-confirm-no"
                  onClick={() => setShowConfirmClear(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {historyList.length > 0 ? (
        <>
          {/* Controls Bar (Search & Sort) */}
          <div className="controls-bar glass-card animate-fade-in">
            <div className="search-container">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="search-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search history by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')} title="Clear search">
                  ✕
                </button>
              )}
            </div>

            <div className="sort-container">
              <label htmlFor="sort-select" className="sort-label">Sort by:</label>
              <select
                id="sort-select"
                className="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Records Grid */}
          {filteredHistory.length > 0 ? (
            <div className="history-grid">
              {filteredHistory.map((item) => (
                <HistoryCard
                  key={item.id}
                  record={item}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-container glass-card animate-fade-in">
              <div className="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 className="empty-state-title">No Search Matches</h3>
              <p className="empty-state-description">
                We couldn't find any conversations matching your search query: "{searchQuery}".
              </p>
              <button className="btn btn-primary" onClick={() => setSearchQuery('')}>
                Clear Search Filter
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="empty-state-container glass-card animate-fade-in">
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 className="empty-state-title">No Conversation History</h3>
          <p className="empty-state-description">
            You haven't had any conversations with the AI Travel chatbot yet.
          </p>
          <Link to="/" className="btn btn-primary">
            Start Chatting Now
          </Link>
        </div>
      )}
    </div>
  );
}
