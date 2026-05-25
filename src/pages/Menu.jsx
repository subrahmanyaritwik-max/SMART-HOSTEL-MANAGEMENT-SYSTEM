import React, { useState } from 'react';
import '../css/Menu.css';

function Menu({ menuItems, setMenuItems, currentUser }) {
  // State for day filtering (null means all days)
  const [selectedDay, setSelectedDay] = useState(null);

  // States for Admin Add Form
  const [newDay, setNewDay] = useState('Monday');
  const [newBreakfast, setNewBreakfast] = useState('');
  const [newLunch, setNewLunch] = useState('');
  const [newDinner, setNewDinner] = useState('');

  // Array of days for filter buttons
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Current Date
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Filtering logic: If a day is selected, filter by that day. Otherwise, show all.
  const displayedMenu = selectedDay 
    ? menuItems.filter(item => item.day === selectedDay)
    : menuItems;

  // Admin function to add new menu
  const handleAddMenu = (e) => {
    e.preventDefault();
    const newItem = {
      id: menuItems.length + 1,
      day: newDay,
      breakfast: newBreakfast,
      lunch: newLunch,
      dinner: newDinner
    };
    setMenuItems([...menuItems, newItem]);
    
    // Clear form
    setNewBreakfast('');
    setNewLunch('');
    setNewDinner('');
    alert('Menu item added successfully!');
  };

  return (
    <div className="menu-container">
      <h2>Hostel Mess Menu</h2>
      <p className="date-display">📅 Today is: {today}</p>
      
      <div className="meal-timings card">
        <p><strong>Breakfast:</strong> 7:30 AM - 9:00 AM</p>
        <p><strong>Lunch:</strong> 12:30 PM - 2:00 PM</p>
        <p><strong>Dinner:</strong> 7:30 PM - 9:00 PM</p>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button 
          className={`btn ${selectedDay === null ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedDay(null)}
        >
          All Days
        </button>
        {days.map(day => (
          <button 
            key={day}
            className={`btn ${selectedDay === day ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Menu Cards Grid */}
      <div className="menu-grid">
        {displayedMenu.length > 0 ? (
          displayedMenu.map((item) => (
            <div key={item.id} className="menu-card card">
              <h3 className="menu-day">{item.day}</h3>
              <div className="meal">
                <h4>🍳 Breakfast</h4>
                <p>{item.breakfast}</p>
              </div>
              <div className="meal">
                <h4>🍲 Lunch</h4>
                <p>{item.lunch}</p>
              </div>
              <div className="meal">
                <h4>🍛 Dinner</h4>
                <p>{item.dinner}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">No menu available for the selected day.</p>
        )}
      </div>

      {/* Conditional Rendering: Only Admin sees the Add Menu Form */}
      {currentUser?.role === 'admin' && (
        <div className="admin-menu-section card mt-4">
          <h3>Admin: Add New Menu</h3>
          <form onSubmit={handleAddMenu} className="flex-col mt-2">
            <label>Day</label>
            <select className="form-input" value={newDay} onChange={(e) => setNewDay(e.target.value)}>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <label>Breakfast</label>
            <input type="text" className="form-input" value={newBreakfast} onChange={(e) => setNewBreakfast(e.target.value)} required />

            <label>Lunch</label>
            <input type="text" className="form-input" value={newLunch} onChange={(e) => setNewLunch(e.target.value)} required />

            <label>Dinner</label>
            <input type="text" className="form-input" value={newDinner} onChange={(e) => setNewDinner(e.target.value)} required />

            <button type="submit" className="btn btn-primary w-100">Add to Menu</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Menu;
