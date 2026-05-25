import React, { useState } from 'react';
import '../css/Warden.css';

function Warden() {
  // Dummy data for wardens
  const [wardens] = useState([
    { id: 1, name: 'Suresh Kumar', phone: '+91 9876543210', block: 'A Block', shift: 'Morning' },
    { id: 2, name: 'Ramesh Singh', phone: '+91 9123456789', block: 'B Block', shift: 'Night' },
    { id: 3, name: 'Kavita Sharma', phone: '+91 9988776655', block: 'Girls Hostel', shift: 'Morning' },
    { id: 4, name: 'Amit Verma', phone: '+91 9001122334', block: 'A Block', shift: 'Night' },
  ]);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering wardens based on search query (name, block, or shift)
  const filteredWardens = wardens.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.shift.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="warden-container">
      <h2>Hostel Wardens</h2>
      
      {/* Search Input */}
      <input 
        type="text" 
        className="form-input search-input" 
        placeholder="🔍 Search by Name, Block, or Shift..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Wardens Grid */}
      <div className="warden-grid">
        {filteredWardens.length > 0 ? (
          filteredWardens.map(warden => (
            <div key={warden.id} className="warden-card card">
              <div className="warden-avatar">👨‍💼</div>
              <h3>{warden.name}</h3>
              <p><strong>Block:</strong> {warden.block}</p>
              <p><strong>Shift:</strong> {warden.shift}</p>
              <p><strong>Phone:</strong> {warden.phone}</p>
              
              <button 
                className="btn btn-success mt-2 w-100"
                onClick={() => alert(`Calling Warden ${warden.name}... 📞`)}
              >
                📞 Call Warden
              </button>
            </div>
          ))
        ) : (
          <p className="empty-state">No wardens found matching your search.</p>
        )}
      </div>
    </div>
  );
}

export default Warden;
