import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import echoEssentialsLogo from "../assets/echoEssentialsLogo.png";
import accountIcon from "../assets/accountIcon.png";
import searchIcon from "../assets/searchIcon.png";
import cartIcon from "../assets/cartIcon.png";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext"; // Import your AuthContext

const Navbar = () => {
  const { logout, user } = useAuth(); // Destructure logout and user from context
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isSearchBarVisible, setSearchBarVisible] = useState(false);
  const navigate = useNavigate();

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
    if (isSearchBarVisible) setSearchBarVisible(false);
  };

  const toggleSearchBar = () => {
    setSearchBarVisible((prev) => !prev);
    if (isUserMenuOpen) setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const userMenu = document.querySelector(".user-account-menu");
      const searchBar = document.querySelector(".search-bar");
      const accountIconElement = document.querySelector(".account-icon");
      const searchIconElement = document.querySelector(".search-icon");

      if (
        userMenu &&
        !userMenu.contains(event.target) &&
        accountIconElement &&
        !accountIconElement.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }

      if (
        searchBar &&
        !searchBar.contains(event.target) &&
        searchIconElement &&
        !searchIconElement.contains(event.target)
      ) {
        setSearchBarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen, isSearchBarVisible]);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img className="logo" src={echoEssentialsLogo} alt="logo" />
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
            alt="search icon"
            onClick={toggleSearchBar}
          />
        </li>
        <li>
          <Link to="/cart">
            <img className="cart-icon" src={cartIcon} alt="cart icon" />
          </Link>
        </li>
        <li>
          <img
            className="account-icon"
            src={accountIcon}
            alt="account icon"
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
            <Link to="/signup">
              <li>Sign Up</li>
            </Link>
            <Link to="/login">
              <li>Login</li>
            </Link>
            {user && user.role === "admin" ? ( // Check if user is admin
              <>
                {console.log("User role:", user.role)} {/* Debugging line */}
                <Link to="/admin">
                  <li>Admin</li>
                </Link>
              </>
            ) : (
              console.log("User is not admin or user is null") // Debugging line
            )}
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
