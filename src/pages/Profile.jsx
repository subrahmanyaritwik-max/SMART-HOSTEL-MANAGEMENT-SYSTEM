import React from 'react';
import '../css/Profile.css';

function Profile({ currentUser }) {
  if (!currentUser || currentUser.role !== 'student') {
    return <p>You must be logged in as a student to view this page.</p>;
  }

  // Dummy data for student profile
  const studentData = {
    name: currentUser.name,
    rollNo: 'CS2023-101',
    course: 'B.Tech Computer Science',
    phone: '+91 9876543210',
    roomNo: '101',
    bedNo: 'A',
    feeStatus: 'Paid',
    feeAmount: '$500 / Semester',
    attendance: '95%'
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      
      <div className="profile-layout mt-4">
        {/* Profile Card */}
        <div className="profile-card card text-center">
          <div className="profile-avatar">👨‍🎓</div>
          <h3>{studentData.name}</h3>
          <p className="text-muted">{studentData.rollNo}</p>
          <span className="badge badge-success mt-2">Active Student</span>
        </div>

        {/* Details Section */}
        <div className="profile-details">
          
          <div className="card info-group">
            <h4>Academic & Contact</h4>
            <p><strong>Course:</strong> {studentData.course}</p>
            <p><strong>Phone:</strong> {studentData.phone}</p>
            <p><strong>Attendance:</strong> {studentData.attendance}</p>
          </div>

          <div className="card info-group">
            <h4>Room Information</h4>
            <p><strong>Room Number:</strong> {studentData.roomNo}</p>
            <p><strong>Bed Number:</strong> {studentData.bedNo}</p>
          </div>

          <div className="card info-group">
            <h4>Fee Status</h4>
            <p><strong>Amount:</strong> {studentData.feeAmount}</p>
            <p><strong>Status:</strong> <span className="text-success font-weight-bold">✅ {studentData.feeStatus}</span></p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
