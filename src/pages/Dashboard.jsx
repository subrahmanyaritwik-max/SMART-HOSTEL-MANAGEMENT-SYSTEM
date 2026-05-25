import React from 'react';
import '../css/Dashboard.css';

function Dashboard({ rooms, complaints }) {
  // Calculating statistics based on props
  const totalRooms = rooms.length;
  const vacantRooms = rooms.filter(r => r.occupied < r.capacity).length;
  
  // Total students = sum of occupied beds
  const totalStudents = rooms.reduce((total, room) => total + room.occupied, 0);
  
  // Pending complaints
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <p className="subtitle">Overview of Hostel Statistics</p>

      {/* Statistics Cards Grid */}
      <div className="stats-grid mt-4">
        <div className="stat-card card text-center">
          <div className="stat-icon">🎓</div>
          <h3>Total Students</h3>
          <p className="stat-number">{totalStudents}</p>
        </div>

        <div className="stat-card card text-center">
          <div className="stat-icon">🛏️</div>
          <h3>Total Rooms</h3>
          <p className="stat-number">{totalRooms}</p>
        </div>

        <div className="stat-card card text-center">
          <div className="stat-icon">✅</div>
          <h3>Vacant Rooms</h3>
          <p className="stat-number text-success">{vacantRooms}</p>
        </div>

        <div className="stat-card card text-center">
          <div className="stat-icon">⚠️</div>
          <h3>Pending Complaints</h3>
          <p className="stat-number text-danger">{pendingComplaints}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions card mt-4">
        <h3>Quick Actions</h3>
        <div className="flex-row gap-10 mt-2">
          <button className="btn btn-primary">➕ Add New Student</button>
          <button className="btn btn-outline">🖨️ Generate Reports</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
