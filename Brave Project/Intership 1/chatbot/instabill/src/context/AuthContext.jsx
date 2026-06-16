// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session and remember_me status
    const storedAuth = localStorage.getItem('instabill_auth');
    const storedToken = localStorage.getItem('instabill_token');

    if (storedAuth && storedToken) {
      try {
        const parsedUser = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (e) {
        localStorage.removeItem('instabill_auth');
        localStorage.removeItem('instabill_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password, remember = false) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        // Form validations
        if (!email || !email.includes('@')) {
          reject(new Error('Please enter a valid email address.'));
          return;
        }
        if (!password || password.length < 6) {
          reject(new Error('Password must be at least 6 characters.'));
          return;
        }

        // Validate mock credentials
        if (email === 'admin@instabill.com' && password === 'admin123') {
          const userData = {
            email,
            name: 'Admin Manager',
            role: 'Store Administrator',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
            loginTime: new Date().toISOString()
          };

          const mockToken = 'mock_jwt_token_eyJhY2Nlc3MiOiJ1c2VyIiwiZXhwIjoxNzg5MjkzMTB9';

          setIsAuthenticated(true);
          setUser(userData);
          setToken(mockToken);

          // Persist login state
          localStorage.setItem('instabill_auth', JSON.stringify(userData));
          localStorage.setItem('instabill_token', mockToken);
          
          if (remember) {
            localStorage.setItem('instabill_remembered_email', email);
          } else {
            localStorage.removeItem('instabill_remembered_email');
          }

          resolve({ user: userData, token: mockToken });
        } else {
          reject(new Error('Invalid email or password. Please verify credentials.'));
        }
      }, 1000); // 1s mock networking delay to display loading spinner
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('instabill_auth');
    localStorage.removeItem('instabill_token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
