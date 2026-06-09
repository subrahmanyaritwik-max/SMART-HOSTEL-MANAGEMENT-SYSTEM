import React, { useState } from 'react';
import ChatInput from '../components/ChatInput';
import ResponseCard from '../components/ResponseCard';
import { sendMessage } from '../services/chatService';
import { saveChatHistory } from '../utils/historyStorage';
import './Home.css';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [currentChat, setCurrentChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const suggestedQuestions = [
    'Do you provide airport pickup?',
    'What vehicles are available?',
    'How can I book a tour package?'
  ];

  const handleSubmit = async (queryText) => {
    const query = queryText.trim();
    if (!query) return;

    setIsLoading(true);
    setError(null);
    // Remove active response when submitting a new query to avoid confusion
    setCurrentChat(null);

    try {
      const result = await sendMessage(query);
      
      // Save details immediately to localStorage
      const savedItem = saveChatHistory(query, result.response);
      
      // Set the response card state
      setCurrentChat({
        question: query,
        response: result.response,
        timestamp: savedItem ? savedItem.timestamp : new Date().toISOString()
      });
      
      // Clear the text area input
      setQuestion('');
    } catch (err) {
      console.error('Submit query failed:', err);
      setError(err.message || 'Failed to fetch response. Please verify that your server is online and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setCurrentChat(null);
    setQuestion('');
    setError(null);
  };

  return (
    <div className="home-page-wrapper">
      {/* Hero Section */}
      <header className="hero-section animate-fade-in">
        <h1 className="hero-title">AI Travel FAQ Chatbot</h1>
        <p className="hero-subtitle">
          Get instant, smart answers to your travel-related questions from Manivtha Tours & Travels.
        </p>
      </header>

      {/* Chat Section */}
      <main className="chat-section-container">
        {error && (
          <div className="error-alert-banner glass-card animate-fade-in">
            <div className="error-alert-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="error-alert-text">
              <span className="error-alert-title">Connection Error</span>
              <p className="error-alert-description">{error}</p>
            </div>
          </div>
        )}

        <ChatInput
          question={question}
          setQuestion={setQuestion}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          suggestedQuestions={suggestedQuestions}
          onClear={handleClear}
          showClear={!!currentChat || !!question}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="loading-card-container glass-card animate-fade-in">
            <div className="loading-spinner-box">
              <div className="spinner"></div>
              <p className="loading-text animate-pulse">Consulting Manivtha AI Travel Guide...</p>
            </div>
          </div>
        )}

        {/* Response Card */}
        {!isLoading && currentChat && (
          <ResponseCard
            question={currentChat.question}
            response={currentChat.response}
            timestamp={currentChat.timestamp}
            onClear={handleClear}
          />
        )}
      </main>
    </div>
  );
}
