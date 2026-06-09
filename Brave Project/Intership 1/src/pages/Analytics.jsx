import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnalyticsCard from '../components/AnalyticsCard';
import { getChatHistory } from '../utils/historyStorage';
import './Analytics.css';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalResponses: 0,
    todayQuestions: 0,
    avgResponseLength: 0,
    mostRecentQuestion: 'No questions asked yet',
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const history = getChatHistory();
    const totalQ = history.length;
    
    // Total Responses are items that have a response
    const totalR = history.filter(item => item.response && item.response.trim()).length;
    
    // Today's Questions (compared in local timezone)
    const today = new Date().toDateString();
    const todayQ = history.filter(item => {
      try {
        return new Date(item.timestamp).toDateString() === today;
      } catch (e) {
        return false;
      }
    }).length;

    // Average Response Length
    const totalLength = history.reduce((sum, item) => sum + (item.response ? item.response.length : 0), 0);
    const avgLen = totalQ > 0 ? Math.round(totalLength / totalQ) : 0;

    // Most Recent Question
    let recentQ = 'No questions asked yet';
    if (totalQ > 0) {
      // Sort history descending by timestamp
      const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      recentQ = sortedHistory[0].question;
    }

    setStats({
      totalQuestions: totalQ,
      totalResponses: totalR,
      todayQuestions: todayQ,
      avgResponseLength: avgLen,
      mostRecentQuestion: recentQ
    });
  };

  // SVG Icons for each metric card
  const totalQuestionsIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );

  const totalResponsesIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );

  const todayQuestionsIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <path d="M8 14h8v4H8z"></path>
    </svg>
  );

  const avgLengthIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <line x1="4" y1="9" x2="20" y2="9"></line>
      <line x1="4" y1="15" x2="20" y2="15"></line>
      <line x1="10" y1="3" x2="8" y2="21"></line>
      <line x1="16" y1="3" x2="14" y2="21"></line>
    </svg>
  );

  const recentIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );

  return (
    <div className="analytics-page-wrapper container">
      {/* Page Header */}
      <header className="page-header animate-fade-in">
        <div className="header-info">
          <h1 className="page-title">Chatbot Analytics</h1>
          <p className="page-subtitle">Analyze usage metrics and user queries stored locally.</p>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <div className="analytics-grid">
        <AnalyticsCard
          title="Total Questions"
          value={stats.totalQuestions}
          subtitle="Total queries submitted"
          icon={totalQuestionsIcon}
          variant="blue"
        />
        <AnalyticsCard
          title="Total Responses"
          value={stats.totalResponses}
          subtitle="Successful AI responses"
          icon={totalResponsesIcon}
          variant="green"
        />
        <AnalyticsCard
          title="Today's Questions"
          value={stats.todayQuestions}
          subtitle="Asked in last 24 hours"
          icon={todayQuestionsIcon}
          variant="indigo"
        />
        <AnalyticsCard
          title="Avg. Response Length"
          value={`${stats.avgResponseLength} Chars`}
          subtitle="Average words/symbols sent"
          icon={avgLengthIcon}
          variant="orange"
        />
      </div>

      {/* Most Recent Question section (Larger layout card) */}
      <div className="recent-question-section glass-card animate-fade-in">
        <div className="recent-header">
          <div className="recent-badge">
            {recentIcon}
            <span>Most Recent Question</span>
          </div>
        </div>
        <div className="recent-body">
          <p className="recent-question-text">
            "{stats.mostRecentQuestion}"
          </p>
        </div>
      </div>

      {/* Redirect footer CTA if no statistics are present */}
      {stats.totalQuestions === 0 && (
        <div className="analytics-empty-cta glass-card animate-fade-in">
          <p>No statistics available yet. Ask a question to start compiling analytics.</p>
          <Link to="/" className="btn btn-primary">
            Start Chat
          </Link>
        </div>
      )}
    </div>
  );
}
