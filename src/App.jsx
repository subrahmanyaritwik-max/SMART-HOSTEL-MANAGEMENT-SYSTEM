import React, { useState, useEffect } from 'react';

// Import CSS for Layout
import './css/App.css';

// Import Components
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';

// Import Pages
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Menu from './pages/Menu';
import Warden from './pages/Warden';
import Complaints from './pages/Complaints';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

function App() {
  // 1. STATE FOR ROUTING & THEME
  const [currentPage, setCurrentPage] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // 2. STATE FOR AUTHENTICATION
  // currentUser can be null (logged out), { role: 'student', name: 'Rithvik' }, or { role: 'admin', name: 'Admin' }
  const [currentUser, setCurrentUser] = useState(null);

  // 3. EFFECT FOR DARK MODE
  // Toggles the 'dark-mode' class on the body tag whenever isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // 4. SHARED DATA STATES (Simulating a Database)
  const [rooms, setRooms] = useState([
    { id: '101', capacity: 2, occupied: 2, studentNames: 'Rithvik, Rahul', electricityBill: '$15' },
    { id: '102', capacity: 2, occupied: 1, studentNames: 'Amit', electricityBill: '$10' },
    { id: '103', capacity: 3, occupied: 0, studentNames: 'None', electricityBill: '$0' },
    { id: '104', capacity: 1, occupied: 1, studentNames: 'Kiran', electricityBill: '$20' },
  ]);

  const [menuItems, setMenuItems] = useState([
    { id: 1, day: 'Monday', breakfast: 'Idli', lunch: 'Dal Rice', dinner: 'Chapati' },
    { id: 2, day: 'Tuesday', breakfast: 'Dosa', lunch: 'Biryani', dinner: 'Paneer' },
  ]);

  const [complaints, setComplaints] = useState([
    { id: 1, student: 'Rithvik', title: 'Fan Not Working', status: 'Pending', reply: '' },
    { id: 2, student: 'Rahul', title: 'Water Leak', status: 'Resolved', reply: 'Fixed by plumber.' }
  ]);

  // 5. RENDER CURRENT PAGE FUNCTION
  const renderPage = () => {
    // If not logged in and trying to access restricted pages, show login
    if (!currentUser && (currentPage === 'profile' || currentPage === 'dashboard' || currentPage === 'complaints')) {
      return <Login setCurrentUser={setCurrentUser} setPage={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'home':
        return <Home setPage={setCurrentPage} />;
      case 'rooms':
        return <Rooms rooms={rooms} currentUser={currentUser} />;
      case 'menu':
        return <Menu menuItems={menuItems} setMenuItems={setMenuItems} currentUser={currentUser} />;
      case 'warden':
        return <Warden />;
      case 'complaints':
        return <Complaints complaints={complaints} setComplaints={setComplaints} currentUser={currentUser} />;
      case 'profile':
        return <Profile currentUser={currentUser} />;
      case 'dashboard':
        return <Dashboard rooms={rooms} complaints={complaints} />;
      case 'login':
        return <Login setCurrentUser={setCurrentUser} setPage={setCurrentPage} />;
      default:
        return <Home setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app-layout">
      {/* LEFT SIDEBAR NAVIGATION */}
      <Sidebar 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser} 
      />

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        {/* Top Header with Theme Toggle & Notifications */}
        <div className="top-header">
          <h2>Hostel Management System</h2>
          <div className="user-controls">
            <Notifications />
            <button 
              className="theme-toggle-btn" 
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>

        {/* Dynamic Page Rendering */}
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
