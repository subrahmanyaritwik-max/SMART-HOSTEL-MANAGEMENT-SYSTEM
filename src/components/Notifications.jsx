import React, { useState } from 'react';
import '../css/Notifications.css';

function Notifications() {
  const [isOpen, setIsOpen] = useState(false);

  // Dummy notifications list
  const alerts = [
    "🔔 Emergency: Water supply cut from 2PM - 4PM",
    "🍽️ New Menu item added for Dinner today!",
    "📢 Notice: Hostel fees due by 15th of this month."
  ];

  return (
    <div className="notifications-container">
      {/* Bell icon button */}
      <button className="bell-btn" onClick={() => setIsOpen(!isOpen)}>
        🔔
        <span className="badge-count">{alerts.length}</span>
      </button>

      {/* Conditional rendering for notification popup dropdown */}
      {isOpen && (
        <div className="notifications-dropdown">
          <h4>Recent Alerts</h4>
          {alerts.length === 0 ? (
            <p className="empty-msg">No new notifications</p>
          ) : (
            <ul className="alerts-list">
              {alerts.map((alert, index) => (
                <li key={index}>{alert}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
