import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role'); // Retrieve the user role from localStorage
    return token ? { token, userId, role } : null; // Set user object with token, userId, and role or null
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = async (username, password) => {
    setLoading(true);
    setError('');
  
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
      if (response.data.success === false) {
        throw new Error(response.data.error || 'Login failed. Please try again.');
      }
  
      const token = response.data.token;
      const userId = response.data.user.id; // Access the correct property for userId
      const role = response.data.user.role; // Access the correct property for user role
      setUser({ token, userId, role });
      
      // Save token, userId, and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role); // Store the role in localStorage
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Remove userId from localStorage
    localStorage.removeItem('role'); // Remove role from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
