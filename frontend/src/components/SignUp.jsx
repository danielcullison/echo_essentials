import React, { useState } from 'react';
import axios from 'axios';
import "../styles/SignUp.css"; // Import the CSS file for styling

const SignUp = () => {
  // State variables for form inputs and messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(''); // For displaying error messages
  const [success, setSuccess] = useState(''); // For displaying success messages

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    try {
      // Send the sign-up data to the backend via a POST request
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/auth/signup`, {
        username,
        password,
        email,
      });
      
      // If successful, set the success message
      setSuccess('User created successfully!');
      
      // Clear input fields after successful sign-up
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (err) {
      // Handle errors returned from the backend
      const errorMessage = err.response?.data?.error || 'An error occurred';
      
      // Custom error handling for specific issues
      if (err.response?.data?.error?.includes('Username already exists')) {
        setError('Username already exists. Please choose a different username.');
      } else if (err.response?.data?.error?.includes('Email is already in use')) {
        setError('Email is already in use. Please use a different email address.');
      } else {
        setError(errorMessage); // General error message
      }
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        {/* Username input field */}
        <div className="signup-input-group">
          <label className="signup-label">Username:</label>
          <input
            type="text"
            className="signup-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
            required
          />
        </div>
        
        {/* Password input field */}
        <div className="signup-input-group">
          <label className="signup-label">Password:</label>
          <input
            type="password"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />
        </div>
        
        {/* Email input field */}
        <div className="signup-input-group">
          <label className="signup-label">Email:</label>
          <input
            type="email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            required
          />
        </div>
        
        {/* Submit button */}
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      
      {/* Display error message if there's an issue with the signup */}
      {error && <p className="signup-error">{error}</p>}
      
      {/* Display success message if signup is successful */}
      {success && <p className="signup-success">{success}</p>}
    </div>
  );
};

export default SignUp;
