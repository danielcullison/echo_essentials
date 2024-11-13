import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation
import "../styles/Profile.css"; // Import Profile-specific CSS

const Profile = () => {
  const { user, logout, error, loading } = useAuth(); // Access user state from AuthContext
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const navigate = useNavigate(); // Initialize the navigate function for routing

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        navigate('/login'); // Redirect to login page if not logged in
        return;
      }

      try {
        // Fetch the user's profile data using the token from AuthContext
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${user.token}` }, // Send token with request
        });

        setProfileData(response.data.user); // Set profile data in state
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfileData(); // Call function to fetch profile data
  }, [user, navigate]); // Re-fetch profile data if `user` changes

  // Handle logout
  const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
    navigate('/login'); // Redirect to login page after logout
  };

  // Display loading state
  if (loading) return <p className="profile-loading">Loading...</p>;

  // Display error message
  if (error) return <p className="profile-error">{error}</p>;

  // Display no profile data message
  if (!profileData) {
    return <div className="profile-empty">No profile data available.</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Your Profile</h1>

      <div className="profile-info">
        <p><strong>ID:</strong> {profileData.id}</p>
        <p><strong>Username:</strong> {profileData.username}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Role:</strong> {profileData.role}</p>
      </div>

      <div className="profile-actions">  
        <button
          onClick={handleLogout} // Call logout function from AuthContext
          className="profile-logout-button"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
