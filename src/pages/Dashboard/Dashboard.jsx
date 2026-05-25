import React from 'react';
import './Dashboard.css';

function Dashboard({ setPage, handleLogout }) {
  const adminCards = [
    { id: 1, title: 'Add Student', icon: '👤', page: 'addStudent', color: 'primary' },
    { id: 2, title: 'Manage Menu', icon: '🍽️', page: 'manageMenu', color: 'success' },
    { id: 3, title: 'Rooms Status', icon: '🛏️', page: 'adminRooms', color: 'info' },
    { id: 4, title: 'Complaints', icon: '📝', page: 'adminComplaints', color: 'warning' },
    { id: 5, title: 'Reports', icon: '📊', page: 'reports', color: 'secondary' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header page-header">
        <h2 className="page-title">Admin Dashboard</h2>
        <p className="page-subtitle">Welcome back, Admin. Manage the hostel efficiently.</p>
        <button className="btn-danger logout-btn" onClick={handleLogout}>
          Logout 🚪
        </button>
      </div>

      <div className="dashboard-grid">
        {adminCards.map((card) => (
          <div 
            key={card.id} 
            className={`dashboard-card glass-card card-${card.color}`}
            onClick={() => setPage(card.page)}
          >
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
