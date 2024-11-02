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
    return token ? { token, userId } : null; // Set user object with token and userId or null
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
      const userId = response.data.user.id; // Change this to access the correct property
      setUser({ token, userId });
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
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
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
