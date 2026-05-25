import React from 'react';
import '../css/Home.css';

// Using Functional Component and Props (setPage)
function Home({ setPage }) {
  
  // Array of features (lists and keys concept)
  const features = [
    { id: 1, title: '🛏️ Rooms', desc: 'Check room availability and details.' },
    { id: 2, title: '🍽️ Menu', desc: 'View today\'s mess menu.' },
    { id: 3, title: '📢 Complaints', desc: 'Register or track complaints.' },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section card">
        <div className="hero-content">
          <h1>Welcome to <span className="text-primary">Aurora Hostel</span></h1>
          <p className="hero-subtitle">Your perfect home away from home. Smart management for smart students.</p>
          <button className="btn btn-primary" onClick={() => setPage('rooms')}>
            View Available Rooms
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <h2 className="section-title">Hostel Features</h2>
      <div className="features-grid">
        {/* Dynamic rendering using map() */}
        {features.map((feature) => (
          <div key={feature.id} className="feature-card card">
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
