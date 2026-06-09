import React from 'react';
import './About.css';

export default function About() {
  const teamMembers = [
    { name: 'Gamini Subrahmanya Ritwik', role: 'Full Stack Developer & Integration Specialist' },
    { name: 'K V Chetan Kumar', role: 'UI/UX Designer & Frontend Engineer' },
    { name: 'Shaik Asif Hussain', role: 'AI Model Trainer & Workflow Engineer' }
  ];

  const technologies = [
    { name: 'React JS (Vite)', category: 'Frontend framework and rapid bundler' },
    { name: 'React Router DOM', category: 'Dynamic page routing and layout management' },
    { name: 'Axios Client', category: 'HTTP communication with n8n endpoint' },
    { name: 'n8n Workflow', category: 'Visual automation orchestrator' },
    { name: 'Gemini AI', category: 'Generates responses for travel questions' },
    { name: 'Local Storage', category: 'Persistent conversation logs and stats' }
  ];

  const workflowSteps = [
    { title: 'User Input', description: 'User submits a travel question in the input field.' },
    { title: 'React Frontend', description: 'Formulates request and handles loading animations.' },
    { title: 'n8n Webhook', description: 'Triggers the serverless automation flow.' },
    { title: 'Gemini AI', description: 'Analyzes query and generates accurate travel answers.' },
    { title: 'History Storage', description: 'Saves conversation logs locally in the client.' },
    { title: 'UI Response', description: 'Displays response text with copy/clear controls.' }
  ];

  return (
    <div className="about-page-wrapper container">
      {/* Page Header */}
      <header className="page-header animate-fade-in">
        <div className="header-info">
          <h1 className="page-title">About Project</h1>
          <p className="page-subtitle">Understand the development team, project objectives, and backend architectures.</p>
        </div>
      </header>

      {/* Grid of Company & Project Info */}
      <div className="grid-2">
        <section className="about-section-card glass-card animate-fade-in">
          <div className="card-header-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="card-header-icon">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <h2 className="about-card-title">Manivtha Tours & Travels</h2>
          </div>
          <p className="about-card-text">
            Manivtha Tours & Travels is a premier tourism service agency committed to delivering extraordinary travel experiences, customized tour planning, hotel reservations, and reliable vehicle rentals. 
          </p>
          <p className="about-card-text">
            To provide tourists and users with immediate answers to their FAQs, we have developed this AI-powered travel assistant to operate 24/7 without delays.
          </p>
        </section>

        <section className="about-section-card glass-card animate-fade-in">
          <div className="card-header-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="card-header-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <h2 className="about-card-title">Project Objectives</h2>
          </div>
          <p className="about-card-text">
            This chatbot project connects a modern, responsive React JS web app to an automated n8n webhook workflow. It processes natural language queries with the Gemini AI LLM.
          </p>
          <p className="about-card-text">
            The app features a custom glassmorphism theme, immediate client-side caching of history, and real-time analytical calculations.
          </p>
        </section>
      </div>

      {/* Workflow Diagram Section */}
      <section className="workflow-section glass-card animate-fade-in">
        <h2 className="workflow-section-title">System Integration Workflow</h2>
        <p className="workflow-section-subtitle">
          Below is the live operational data-flow outlining how questions turn into responses.
        </p>

        <div className="workflow-visual-flow">
          {workflowSteps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="workflow-node-box">
                <div className="workflow-node-number">{index + 1}</div>
                <h3 className="workflow-node-title">{step.title}</h3>
                <p className="workflow-node-desc">{step.description}</p>
              </div>
              {index < workflowSteps.length - 1 && (
                <div className="workflow-arrow-connector">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="arrow-svg">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Grid of Team and Tech Stack */}
      <div className="grid-2">
        <section className="about-section-card glass-card animate-fade-in">
          <h2 className="about-card-title margin-bottom-md">Project Development Team</h2>
          <div className="team-list">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member-item">
                <div className="team-member-avatar">
                  <span>{member.name.charAt(0)}</span>
                </div>
                <div className="team-member-details">
                  <h4 className="team-member-name">{member.name}</h4>
                  <span className="team-member-role">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section-card glass-card animate-fade-in">
          <h2 className="about-card-title margin-bottom-md">Technology Stack</h2>
          <div className="tech-grid">
            {technologies.map((tech, index) => (
              <div key={index} className="tech-badge-item">
                <span className="tech-badge-name">{tech.name}</span>
                <span className="tech-badge-description">{tech.category}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
