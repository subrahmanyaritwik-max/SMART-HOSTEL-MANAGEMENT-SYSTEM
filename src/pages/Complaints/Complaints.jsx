import React, { useState } from 'react';
import ComplaintItem from '../../components/ComplaintItem/ComplaintItem';
import './Complaints.css';

// Complaints page — form, list, delete, and total count
function Complaints({ complaints, setComplaints }) {
  // useState to manage form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Event handler — form submission
  const handleAddComplaint = (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Please fill out both fields');
      return;
    }

    const newComplaint = {
      id: Date.now(),
      title: title,
      description: description,
    };

    // Update state using spread operator
    setComplaints([...complaints, newComplaint]);

    // Clear form inputs
    setTitle('');
    setDescription('');
  };

  // Event handler — delete complaint by ID
  const handleDelete = (id) => {
    const updatedComplaints = complaints.filter((c) => c.id !== id);
    setComplaints(updatedComplaints);
  };

  return (
    <div className="complaints-container">
      <div className="page-header">
        <h2 className="page-title">File a Complaint</h2>
        <p className="page-subtitle">Submit and manage hostel complaints</p>
      </div>

      {/* Complaint form — Forms concept */}
      <form onSubmit={handleAddComplaint} className="complaint-form">
        <div className="form-group">
          <label>Complaint Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Broken Fan"
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">➕ Add Complaint</button>
      </form>

      {/* Total complaints count badge */}
      <div className="complaints-header">
        <h3>Recent Complaints</h3>
        <span className="complaints-count">
          Total: {complaints.length}
        </span>
      </div>

      {/* Conditional Rendering — show message if no complaints */}
      {complaints.length === 0 ? (
        <div className="no-complaints">
          <p>🎉 No complaints filed yet. Everything looks good!</p>
        </div>
      ) : (
        <div className="complaints-list">
          {/* Lists and Keys — rendering complaint items using map() */}
          {complaints.map((complaint) => (
            <ComplaintItem
              key={complaint.id}
              complaint={complaint}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Complaints;
