import React, { useState } from 'react';
import './Menu.css';

// Menu page — shows weekly breakfast, lunch, dinner cards
function Menu({ menuItems, setMenuItems, isAdmin }) {
  // useState to manage form inputs for Admin
  const [day, setDay] = useState('');
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');

  // useState for day selector filter
  const [selectedDay, setSelectedDay] = useState(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddMenu = (e) => {
    e.preventDefault();
    if (!day || !breakfast || !lunch || !dinner) {
      alert('Please fill out all fields');
      return;
    }

    const newItem = {
      id: Date.now(),
      day,
      emoji: '✨',
      breakfast,
      lunch,
      dinner,
    };

    setMenuItems([...menuItems, newItem]);
    
    // Clear form
    setDay('');
    setBreakfast('');
    setLunch('');
    setDinner('');
  };

  const filteredMenu = selectedDay 
    ? menuItems.filter(item => item.day.toLowerCase() === selectedDay.toLowerCase()) 
    : menuItems;

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="menu-container">
      <div className="page-header">
        <h2 className="page-title">{isAdmin ? 'Manage Mess Menu' : 'Hostel Mess Menu'}</h2>
        <p className="page-subtitle">Weekly Breakfast, Lunch and Dinner Schedule</p>
      </div>

      {/* Admin Form */}
      {isAdmin && (
        <form onSubmit={handleAddMenu} className="menu-form glass-card">
          <h3>Add New Menu Item</h3>
          <div className="form-group">
            <label>Day:</label>
            <input type="text" value={day} onChange={(e) => setDay(e.target.value)} placeholder="e.g. Special Sunday" />
          </div>
          <div className="form-group">
            <label>Breakfast:</label>
            <input type="text" value={breakfast} onChange={(e) => setBreakfast(e.target.value)} placeholder="Breakfast Item" />
          </div>
          <div className="form-group">
            <label>Lunch:</label>
            <input type="text" value={lunch} onChange={(e) => setLunch(e.target.value)} placeholder="Lunch Item" />
          </div>
          <div className="form-group">
            <label>Dinner:</label>
            <input type="text" value={dinner} onChange={(e) => setDinner(e.target.value)} placeholder="Dinner Item" />
          </div>
          <button type="submit" className="btn-primary">➕ Add Menu</button>
        </form>
      )}

      {/* Day Selector */}
      <div className="day-selector-container">
        <button 
          className={`day-btn ${selectedDay === null ? 'active' : ''}`}
          onClick={() => setSelectedDay(null)}
        >
          All Days
        </button>
        {daysOfWeek.map(dayName => (
          <button
            key={dayName}
            className={`day-btn ${selectedDay === dayName ? 'active' : ''}`}
            onClick={() => setSelectedDay(dayName)}
          >
            {dayName}
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="selected-day-info glass-card">
          <h3>📅 {currentDate}</h3>
          <div className="meal-timings">
            <span className="timing-badge">🌅 Breakfast: 8:00 AM</span>
            <span className="timing-badge">☀️ Lunch: 1:00 PM</span>
            <span className="timing-badge">🌙 Dinner: 8:00 PM</span>
          </div>
        </div>
      )}

      {/* Rendering menu cards using map() — Lists and Keys */}
      <div className="menu-grid">
        {filteredMenu.map((item) => (
          <div key={item.id} className="menu-card glass-card">
            <div className="menu-day-header">
              <span className="menu-emoji">{item.emoji || '✨'}</span>
              <h3>{item.day}</h3>
            </div>

            <div className="meal-item">
              <span className="meal-label">🌅 Breakfast</span>
              <span className="meal-name">{item.breakfast}</span>
            </div>

            <div className="meal-item">
              <span className="meal-label">☀️ Lunch</span>
              <span className="meal-name">{item.lunch}</span>
            </div>

            <div className="meal-item">
              <span className="meal-label">🌙 Dinner</span>
              <span className="meal-name">{item.dinner}</span>
            </div>
          </div>
        ))}
        {filteredMenu.length === 0 && (
          <div className="no-menu-msg">
            <p>No menu found for {selectedDay}.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;