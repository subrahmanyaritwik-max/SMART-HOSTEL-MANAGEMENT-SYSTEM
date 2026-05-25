import React, { useState } from 'react';
import '../css/Rooms.css';

function Rooms({ rooms }) {
  // State for controlling the popup modal
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Event handler to open modal
  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  // Event handler to close modal
  const closeModal = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="rooms-container">
      <h2>Hostel Rooms</h2>
      <p className="subtitle">Click on a room to see electricity bills and student details.</p>

      {/* Responsive grid layout using CSS Grid */}
      <div className="rooms-grid">
        {/* Dynamic rendering with map() */}
        {rooms.map((room) => {
          // Calculate if room is fully occupied
          const isFull = room.occupied >= room.capacity;

          return (
            <div 
              key={room.id} 
              // Different colors based on occupied/vacant using conditional CSS classes
              className={`room-card card ${isFull ? 'room-full' : 'room-vacant'}`}
              onClick={() => handleRoomClick(room)}
            >
              <h3>Room {room.id}</h3>
              <p>Capacity: {room.capacity}</p>
              <p>Occupied: {room.occupied}</p>
              <span className="status-badge">
                {isFull ? '🔴 Full' : '🟢 Vacant'}
              </span>
              
              {!isFull && (
                <button 
                  className="btn btn-primary mt-2 w-100"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents opening the modal when clicking Book
                    alert(`Booking requested for Room ${room.id}`);
                  }}
                >
                  Book Room
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Popup Modal - Conditional Rendering */}
      {selectedRoom && (
        <div className="modal-overlay" onClick={closeModal}>
          {/* Prevent clicks inside modal from closing it */}
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Room {selectedRoom.id} Details</h3>
              <button className="close-btn" onClick={closeModal}>❌</button>
            </div>
            <div className="modal-body">
              <p><strong>Students:</strong> {selectedRoom.studentNames}</p>
              <p><strong>Electricity Bill:</strong> <span className="text-danger">{selectedRoom.electricityBill}</span></p>
              <p><strong>Capacity:</strong> {selectedRoom.capacity} Beds</p>
              <p><strong>Available Beds:</strong> {selectedRoom.capacity - selectedRoom.occupied}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;
