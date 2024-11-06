import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import echoEssentialsLogo from "../assets/echoEssentialsLogo.png";
import accountIcon from "../assets/accountIcon.png";
import searchIcon from "../assets/searchIcon.png";
import cartIcon from "../assets/cartIcon.png";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext"; // Import your AuthContext for user authentication

const Navbar = () => {
  const { logout, user } = useAuth(); // Destructure logout function and user object from context
  const [isUserMenuOpen, setUserMenuOpen] = useState(false); // Track whether the user menu is open
  const [isSearchBarVisible, setSearchBarVisible] = useState(false); // Track visibility of search bar
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Toggle the visibility of the user menu
  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev); // Toggle user menu state
    if (isSearchBarVisible) setSearchBarVisible(false); // Close the search bar if it's open
  };

  // Toggle the visibility of the search bar
  const toggleSearchBar = () => {
    setSearchBarVisible((prev) => !prev); // Toggle search bar state
    if (isUserMenuOpen) setUserMenuOpen(false); // Close the user menu if it's open
  };

  // Handle logout functionality
  const handleLogout = () => {
    logout(); // Call logout function from context
    navigate("/"); // Redirect to homepage after logout
  };

  // Close user menu or search bar if user clicks outside of them
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userMenu = document.querySelector(".user-account-menu");
      const searchBar = document.querySelector(".search-bar");
      const accountIconElement = document.querySelector(".account-icon");
      const searchIconElement = document.querySelector(".search-icon");

      // Close user menu if click is outside the menu or account icon
      if (
        userMenu &&
        !userMenu.contains(event.target) &&
        accountIconElement &&
        !accountIconElement.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }

      // Close search bar if click is outside the search bar or search icon
      if (
        searchBar &&
        !searchBar.contains(event.target) &&
        searchIconElement &&
        !searchIconElement.contains(event.target)
      ) {
        setSearchBarVisible(false);
      }
    };

    // Add event listener for detecting outside clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener when component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen, isSearchBarVisible]); // Re-run effect when user menu or search bar state changes

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img className="logo" src={echoEssentialsLogo} alt="Echo Essentials Logo" />
        </Link>
      </div>
      <ul className="nav-links">
        <li className="home">
          <Link to="/">Home</Link>
        </li>
        <li className="products">
          <Link to="/products">Products</Link>
        </li>
        <li>
          <img
            className="search-icon"
            src={searchIcon}
            alt="Search Icon"
            onClick={toggleSearchBar}
          />
        </li>
        <li>
          <Link to="/cart">
            <img className="cart-icon" src={cartIcon} alt="Cart Icon" />
          </Link>
        </li>
        <li>
          <img
            className="account-icon"
            src={accountIcon}
            alt="Account Icon"
            onClick={toggleUserMenu}
          />
        </li>
      </ul>
      <div className={`search-bar ${isSearchBarVisible ? "active" : ""}`}>
        <input type="text" placeholder="Search products..." />
      </div>
      {isUserMenuOpen && (
        <div className={`user-account-menu active`}>
          <ul>
            {/* Links for user authentication actions */}
            <Link to="/signup">
              <li>Sign Up</li>
            </Link>
            <Link to="/login">
              <li>Login</li>
            </Link>
            {user && user.role === "admin" && (
              // Show admin link if the user is an admin
              <Link to="/admin">
                <li>Admin</li>
              </Link>
            )}
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
