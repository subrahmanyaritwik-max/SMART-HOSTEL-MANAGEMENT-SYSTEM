import React from 'react';
import './ChatInput.css';

export default function ChatInput({
  question,
  setQuestion,
  onSubmit,
  isLoading,
  suggestedQuestions,
  onClear,
  showClear
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (question.trim() && !isLoading) {
        onSubmit(question);
      }
    }
  };

  const handleSuggestClick = (q) => {
    if (!isLoading) {
      setQuestion(q);
      onSubmit(q);
    }
  };

  return (
    <div className="chat-input-wrapper animate-fade-in">
      {/* Input area */}
      <div className="input-box-container glass-card">
        <textarea
          className="chat-textarea"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about airport pickup, available vehicles, tour packages..."
          rows="3"
          disabled={isLoading}
        />
        <div className="input-actions-bar">
          <span className="character-count">{question.length}/500 chars</span>
          <div className="button-group">
            {showClear && (
              <button
                type="button"
                className="btn btn-secondary btn-clear"
                onClick={onClear}
                disabled={isLoading}
                title="Clear current response and input"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => onSubmit(question)}
              className="btn btn-primary btn-submit"
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? (
                <>
                  <div className="spinner-small"></div>
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <svg
                    className="send-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  <span>Ask AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Suggested questions */}
      {suggestedQuestions && suggestedQuestions.length > 0 && (
        <div className="suggested-questions-container">
          <p className="suggested-title">Suggested Questions:</p>
          <div className="suggested-chips">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                className="suggested-chip"
                onClick={() => handleSuggestClick(q)}
                disabled={isLoading}
              >
                <svg
                  className="chip-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
