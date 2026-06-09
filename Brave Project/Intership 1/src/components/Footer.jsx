import React from 'react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer-wrapper">
      <div className="container footer-container">
        <div className="footer-brand-section">
          <div className="footer-logo">
            <svg
              className="footer-logo-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
            <span className="footer-brand-text">Manivtha Tours & Travels</span>
          </div>
          <p className="footer-description">
            Your trusted partner for personalized holiday packages, premium vehicle rentals, and seamless travel transfers.
          </p>
        </div>

        <div className="footer-team-section">
          <h4 className="footer-heading">Project Development Team</h4>
          <ul className="footer-team-list">
            <li>Gamini Subrahmanya Ritwik</li>
            <li>K V Chetan Kumar</li>
            <li>Shaik Asif Hussain</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p>&copy; {currentYear} Manivtha Tours & Travels. All rights reserved.</p>
          <p className="footer-tagline">AI Travel Support Chatbot Project</p>
        </div>
      </div>
    </footer>
  );
}
