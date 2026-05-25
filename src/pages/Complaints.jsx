import React, { useState } from 'react';
import '../css/Complaints.css';

function Complaints({ complaints, setComplaints, currentUser }) {
  // State for new complaint form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // States for Admin Reply
  const [replyText, setReplyText] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('In Progress');

  // Handle student submitting a new complaint
  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    const newComplaint = {
      id: complaints.length + 1,
      student: currentUser.name,
      title: newTitle,
      description: newDesc,
      status: 'Pending',
      reply: ''
    };
    setComplaints([...complaints, newComplaint]);
    setNewTitle('');
    setNewDesc('');
    alert('Complaint registered successfully!');
  };

  // Handle admin updating a complaint
  const handleAdminUpdate = (id) => {
    const updatedComplaints = complaints.map(c => 
      c.id === id ? { ...c, status: statusUpdate, reply: replyText } : c
    );
    setComplaints(updatedComplaints);
    setReplyText('');
    alert('Complaint updated successfully!');
  };

  return (
    <div className="complaints-container">
      <h2>Hostel Complaints</h2>

      {/* Student View: Form to add complaint */}
      {currentUser?.role === 'student' && (
        <div className="card new-complaint-section">
          <h3>Register a Complaint</h3>
          <form onSubmit={handleSubmitComplaint} className="flex-col mt-2">
            <label>Complaint Title</label>
            <input 
              type="text" 
              className="form-input" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              required 
            />

            <label>Description</label>
            <textarea 
              className="form-input" 
              rows="3" 
              value={newDesc} 
              onChange={(e) => setNewDesc(e.target.value)} 
              required 
            ></textarea>

            <button type="submit" className="btn btn-primary">Submit Complaint</button>
          </form>
        </div>
      )}

      {/* List of Complaints */}
      <div className="complaints-list">
        <h3>Recent Complaints</h3>
        {complaints.length > 0 ? (
          complaints.map(complaint => (
            <div key={complaint.id} className={`complaint-card card status-${complaint.status.replace(' ', '')}`}>
              <div className="flex-row justify-between">
                <h4>{complaint.title}</h4>
                <span className={`badge badge-${complaint.status.replace(' ', '')}`}>{complaint.status}</span>
              </div>
              <p className="student-name">Reported by: {complaint.student}</p>
              {complaint.description && <p className="desc">{complaint.description}</p>}
              
              {/* Show admin reply if exists */}
              {complaint.reply && (
                <div className="admin-reply">
                  <strong>Admin Reply:</strong> {complaint.reply}
                </div>
              )}

              {/* Admin View: Controls to update status and add reply */}
              {currentUser?.role === 'admin' && complaint.status !== 'Resolved' && (
                <div className="admin-controls mt-2">
                  <select 
                    className="form-input" 
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    defaultValue="In Progress"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Admin reply..." 
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  
                  <button 
                    className="btn btn-primary w-100" 
                    onClick={() => handleAdminUpdate(complaint.id)}
                  >
                    Update Complaint
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="empty-state">No complaints registered.</p>
        )}
      </div>
    </div>
  );
}

export default Complaints;
