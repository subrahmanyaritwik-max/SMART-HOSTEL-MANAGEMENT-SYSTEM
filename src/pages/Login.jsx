import React, { useState } from 'react';
import '../css/Login.css';

function Login({ setCurrentUser, setPage }) {
  // Simple state for login forms
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Event handler for form submission
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple dummy authentication
    if (role === 'student' && username === 'student' && password === '123') {
      setCurrentUser({ role: 'student', name: 'Rithvik' });
      setPage('home'); // Redirect to home after login
    } else if (role === 'admin' && username === 'admin' && password === 'admin123') {
      setCurrentUser({ role: 'admin', name: 'Warden Sir' });
      setPage('dashboard'); // Redirect admin to dashboard
    } else {
      setErrorMsg('Invalid username or password!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card">
        <h2 className="text-center">Hostel Login</h2>
        
        {/* Role Toggle Buttons */}
        <div className="role-toggle flex-row justify-center">
          <button 
            className={`btn ${role === 'student' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setRole('student'); setErrorMsg(''); }}
          >
            Student
          </button>
          <button 
            className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setRole('admin'); setErrorMsg(''); }}
          >
            Admin
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex-col">
          <label>Username</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder={`Enter ${role} username...`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Conditional rendering for error message */}
          {errorMsg && <p className="error-text">{errorMsg}</p>}

          <button type="submit" className="btn btn-primary w-100 mt-2">Login</button>
        </form>

        <div className="login-hints">
          <p><strong>Hints:</strong></p>
          <p>Student: user <code>student</code> | pass <code>123</code></p>
          <p>Admin: user <code>admin</code> | pass <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
