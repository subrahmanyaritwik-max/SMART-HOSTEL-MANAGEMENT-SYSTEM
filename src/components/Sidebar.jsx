import React from 'react';
import '../css/Sidebar.css';

function Sidebar({ currentPage, setPage, currentUser, setCurrentUser }) {
  
  // Navigation links logic based on whether user is logged in
  const navLinks = [
    { id: 'home', label: '🏠 Home', requiresAuth: false },
    { id: 'rooms', label: '🛏️ Rooms', requiresAuth: false },
    { id: 'menu', label: '🍽️ Menu', requiresAuth: false },
    { id: 'warden', label: '👨‍💼 Warden', requiresAuth: false },
  ];

  // Specific links for students
  if (currentUser?.role === 'student') {
    navLinks.push({ id: 'profile', label: '👤 My Profile', requiresAuth: true });
    navLinks.push({ id: 'complaints', label: '📢 Complaints', requiresAuth: true });
  }

  // Specific links for admin
  if (currentUser?.role === 'admin') {
    navLinks.push({ id: 'dashboard', label: '📊 Dashboard', requiresAuth: true });
    navLinks.push({ id: 'complaints', label: '📢 Manage Complaints', requiresAuth: true });
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('home');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Aurora Hostel</h3>
      </div>
      
      <ul className="sidebar-links">
        {/* Dynamic rendering with map() */}
        {navLinks.map(link => (
          <li key={link.id}>
            <button 
              className={currentPage === link.id ? 'active-link' : ''}
              onClick={() => setPage(link.id)}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Conditional Rendering for Login/Logout */}
      <div className="sidebar-footer">
        {currentUser ? (
          <div className="user-info">
            <p>Welcome, {currentUser.name}</p>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="btn btn-primary login-btn" onClick={() => setPage('login')}>
            🔐 Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
