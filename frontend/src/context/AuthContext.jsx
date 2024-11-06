import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Create the AuthContext to share authentication-related data across components
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext); // Returns the current auth context values
};

// AuthProvider component that wraps the app and provides authentication state
export const AuthProvider = ({ children }) => {
  // Initialize user state with values from localStorage if available
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role'); // Retrieve the user role from localStorage
    return token ? { token, userId, role } : null; // Return user object if token exists, otherwise null
  });

  // State for handling errors and loading state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login function to authenticate the user
  const login = async (username, password) => {
    setLoading(true); // Set loading to true while the request is in progress
    setError(''); // Clear any previous error messages

    try {
      // Make a POST request to the login endpoint with the username and password
      const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });

      // If login is unsuccessful, throw an error with a message
      if (response.data.success === false) {
        throw new Error(response.data.error || 'Login failed. Please try again.');
      }

      // Extract user details and token from the response
      const token = response.data.token;
      const userId = response.data.user.id; // Extract userId from the response
      const role = response.data.user.role; // Extract user role from the response

      // Update the user state and store data in localStorage
      setUser({ token, userId, role });
      localStorage.setItem('token', token); // Store token in localStorage
      localStorage.setItem('userId', userId); // Store userId in localStorage
      localStorage.setItem('role', role); // Store role in localStorage
    } catch (err) {
      setError(err.message); // Set error message if the login request fails
    } finally {
      setLoading(false); // Set loading to false after the request is completed
    }
  };

  // Logout function to clear user data and remove from localStorage
  const logout = () => {
    setUser(null); // Reset user state
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('userId'); // Remove userId from localStorage
    localStorage.removeItem('role'); // Remove role from localStorage
  };

  return (
    // Provide the auth context to children components
    <AuthContext.Provider value={{ user, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
