import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import { useAuth } from '../context/AuthContext.jsx'; // Custom hook for authentication context
import "../styles/Login.css"; // Import styles for the login page

const Login = () => {
  const { login, error, loading, user } = useAuth(); // Destructure login function, error state, loading state, and user info from auth context
  const [username, setUsername] = useState(''); // Local state to store the entered username
  const [password, setPassword] = useState(''); // Local state to store the entered password
  
  const navigate = useNavigate(); // Initialize the navigate function to programmatically redirect users

  // If the user is already logged in, redirect to the products page
  useEffect(() => {
    if (user) {
      navigate('/products');
    }
  }, [user, navigate]); // Re-run the effect whenever the user state changes

  // Handle the form submission, trigger login, and handle the response
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const success = await login(username, password); // Attempt login with provided username and password
    
    if (success) {
      // If login is successful, redirect to the products page
      navigate('/products');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {/* Username input */}
        <div className="login-input-group">
          <label htmlFor="username" className="login-label">Username:</label>
          <input
            type="text"
            id="username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state on input change
            required
          />
        </div>

        {/* Password input */}
        <div className="login-input-group">
          <label htmlFor="password" className="login-label">Password:</label>
          <input
            type="password"
            id="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state on input change
            required
          />
        </div>

        {/* Display error message if there is one */}
        {error && <p className="login-error">{error}</p>}
        
        {/* Display success message if login is successful */}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'} {/* Show "Logging in..." while the login is in progress */}
        </button>
      </form>
    </div>
  );
};

export default Login;
