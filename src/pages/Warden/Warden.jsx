import React, { useState } from 'react';
import WardenTable from '../../components/WardenTable/WardenTable';
import './Warden.css';

// Warden page — shows warden contacts in table with search
function Warden() {
  // Array of warden data — Lists and Keys
  const wardensList = [
    { id: 1, name: 'Mr. Rajesh Kumar', phone: '9876543210', block: 'Block A', shift: 'Day' },
    { id: 2, name: 'Mr. Sunil Sharma', phone: '9123456789', block: 'Block B', shift: 'Night' },
    { id: 3, name: 'Mrs. Priya Reddy', phone: '9988776655', block: 'Block A', shift: 'Night' },
    { id: 4, name: 'Mr. Venkat Rao', phone: '9876512345', block: 'Block C', shift: 'Day' },
    { id: 5, name: 'Mrs. Lakshmi Devi', phone: '9001122334', block: 'Block B', shift: 'Day' },
    { id: 6, name: 'Mr. Anil Verma', phone: '9112233445', block: 'Block C', shift: 'Night' },
  ];

  // useState for search input
  const [searchText, setSearchText] = useState('');

  // Filter wardens based on search text (name, block, or shift)
  const filteredWardens = wardensList.filter((warden) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      warden.name.toLowerCase().includes(lowerSearch) ||
      warden.block.toLowerCase().includes(lowerSearch) ||
      warden.shift.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="warden-container">
      <h2>👨‍💼 Warden Contacts</h2>
      <p>Search and contact hostel wardens quickly</p>

      {/* Search input — Forms + useState */}
      <div className="warden-search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by name, block, or shift..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="warden-search-input"
        />
      </div>

      {/* Conditional Rendering — show message or table */}
      {filteredWardens.length === 0 ? (
        <div className="no-results">
          <p>😕 No wardens found matching "{searchText}"</p>
        </div>
      ) : (
        <WardenTable wardens={filteredWardens} />
      )}

      {/* Result count */}
      <p className="result-count">
        Showing {filteredWardens.length} of {wardensList.length} wardens
      </p>
    </div>
  );
}

export default Warden;
