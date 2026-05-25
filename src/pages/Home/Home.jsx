import React from 'react';
import './Home.css';

// Home component receives setPage as props to navigate to other pages
function Home({ setPage }) {
  // Array of quick-access buttons — uses Lists and Keys
  const quickLinks = [
    { id: 1, label: '🛏️ View Rooms', page: 'rooms', style: 'btn-rooms' },
    { id: 2, label: '📝 Complaints', page: 'complaints', style: 'btn-complaints' },
    { id: 3, label: '🍽️ Mess Menu', page: 'menu', style: 'btn-menu' },
    { id: 4, label: '👨‍💼 Warden', page: 'warden', style: 'btn-warden' },
    { id: 5, label: '📢 Notices', page: 'notices', style: 'btn-notices' },
    { id: 6, label: '🔐 Admin Login', page: 'admin', style: 'btn-warden' },
  ];

  return (
    <div className="home-container">
      {/* Floating decorative shapes for visual appeal */}
      <div className="home-shape home-shape-1"></div>
      <div className="home-shape home-shape-2"></div>
      <div className="home-shape home-shape-3"></div>

      <div className="welcome-box">
        {/* Logo */}
        <div className="logo-wrapper">
          <span className="home-logo-emoji">🏠</span>
        </div>

        {/* Welcome message */}
        <h1>Welcome to <span className="highlight">Aurora Hostel</span></h1>
        <p>Your home away from home. Manage your stay easily and efficiently.</p>

        {/* Feature badges */}
        <div className="feature-badges">
          <span className="badge">✅ 50+ Rooms</span>
          <span className="badge">✅ 24/7 Security</span>
          <span className="badge">✅ Wi-Fi Enabled</span>
        </div>

        {/* Navigation buttons — Event Handling + map() */}
        <div className="action-buttons">
          {quickLinks.map((link) => (
            <button
              key={link.id}
              className={`home-btn ${link.style}`}
              onClick={() => setPage(link.page)}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;