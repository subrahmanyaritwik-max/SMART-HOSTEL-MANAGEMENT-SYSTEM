import React, { useState } from 'react';
import RoomCard from '../../components/RoomCard/RoomCard';
import './Rooms.css';

// Rooms page — shows room cards and a popup modal with details
function Rooms() {
  // Array of room data — Lists and Keys
  const roomsList = [
    { id: 1, number: '101', isOccupied: true, studentName: 'Rithvik', feeStatus: 'Paid', electricityBill: '₹1200', complaint: 'Fan not working' },
    { id: 2, number: '102', isOccupied: false, studentName: '', feeStatus: 'N/A', electricityBill: '-', complaint: 'No Complaints' },
    { id: 3, number: '103', isOccupied: true, studentName: 'Rahul', feeStatus: 'Pending', electricityBill: '₹950', complaint: 'Tap leaking' },
    { id: 4, number: '104', isOccupied: false, studentName: '', feeStatus: 'N/A', electricityBill: '-', complaint: 'No Complaints' },
    { id: 5, number: '105', isOccupied: true, studentName: 'Amit', feeStatus: 'Paid', electricityBill: '₹1100', complaint: 'No Complaints' },
    { id: 6, number: '106', isOccupied: true, studentName: 'Kiran', feeStatus: 'Paid', electricityBill: '₹800', complaint: 'Light not working' },
    { id: 7, number: '107', isOccupied: false, studentName: '', feeStatus: 'N/A', electricityBill: '-', complaint: 'No Complaints' },
    { id: 8, number: '108', isOccupied: true, studentName: 'Suresh', feeStatus: 'Pending', electricityBill: '₹1350', complaint: 'AC not cooling' },
    { id: 9, number: '109', isOccupied: false, studentName: '', feeStatus: 'N/A', electricityBill: '-', complaint: 'No Complaints' },
    { id: 10, number: '110', isOccupied: true, studentName: 'Varun', feeStatus: 'Paid', electricityBill: '₹1000', complaint: 'No Complaints' },
  ];

  // useState to track the selected room (null = no modal open)
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Event handler — open popup
  const openModal = (room) => {
    setSelectedRoom(room);
  };

  // Event handler — close popup
  const closeModal = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="rooms-container">
      <div className="page-header">
        <h2 className="page-title">Hostel Rooms</h2>
        <p className="page-subtitle">Click any room card to view full details</p>
      </div>

      {/* Rendering rooms using map() — Lists and Keys */}
      <div className="rooms-grid">
        {roomsList.map((room) => (
          <div key={room.id} onClick={() => openModal(room)}>
            <RoomCard room={room} />
          </div>
        ))}
      </div>

      {/* Conditional Rendering — show modal only when a room is selected */}
      {selectedRoom !== null && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔑 Room {selectedRoom.number} Details</h3>
              <button className="modal-close-btn" onClick={closeModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-row">
                <span className="modal-label">Room Number</span>
                <span className="modal-value">{selectedRoom.number}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Student Name</span>
                <span className="modal-value">
                  {selectedRoom.studentName === '' ? 'No Student' : selectedRoom.studentName}
                </span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Fee Status</span>
                <span className={`modal-value ${selectedRoom.feeStatus === 'Paid' ? 'status-paid' : selectedRoom.feeStatus === 'Pending' ? 'status-pending' : ''}`}>
                  {selectedRoom.feeStatus}
                </span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Electricity Bill</span>
                <span className="modal-value">{selectedRoom.electricityBill}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Complaint Status</span>
                <span className="modal-value">{selectedRoom.complaint}</span>
              </div>
            </div>

            <div className="modal-actions">
              {!selectedRoom.isOccupied && (
                <button 
                  className="modal-action-btn btn-book" 
                  onClick={() => {
                    alert('Room Booking Request Sent!');
                    closeModal();
                  }}
                >
                  Book Room
                </button>
              )}
              <button className="modal-action-btn btn-close" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;