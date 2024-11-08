import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import echoEssentialsLogo from "../assets/echoEssentialsLogo.png";
import accountIcon from "../assets/accountIcon.png";
import searchIcon from "../assets/searchIcon.png";
import cartIcon from "../assets/cartIcon.png";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { products } = useProducts();
  const { logout, user } = useAuth();
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isSearchBarVisible, setSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  
  // Refs for detecting click outside the search bar
  const searchBarRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle search input change and filter products
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      // Filter products based on search query
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]); // Clear suggestions when query is short
    }
  };

  // Handle product click and navigate to product detail page
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    setSearchQuery(""); // Clear search input
    setFilteredProducts([]); // Clear filtered products
  };

  // Toggle the visibility of the user menu
  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
    if (isSearchBarVisible) setSearchBarVisible(false); // Close search bar if open
  };

  // Toggle the visibility of the search bar
  const toggleSearchBar = () => {
    setSearchBarVisible((prev) => !prev);
    if (isUserMenuOpen) setUserMenuOpen(false); // Close user menu if open
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to homepage after logout
  };

  // Close the search bar or user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target) && !event.target.closest('.search-icon')) {
        setSearchBarVisible(false);
        setFilteredProducts([]);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target) && !event.target.closest('.account-icon')) {
        setUserMenuOpen(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener('click', handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
      <div ref={searchBarRef} className={`search-bar ${isSearchBarVisible ? "active" : ""}`}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {filteredProducts.length > 0 && (
          <div className="search-dropdown">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="search-result"
                onClick={() => handleProductClick(product.id)}
              >
                <h4>{product.name}</h4>
                <p>{`$${product.price.toFixed(2)}`}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {isUserMenuOpen && (
        <div ref={userMenuRef} className={`user-account-menu active`}>
          <ul>
            {!user ? (
              <>
                <Link to="/signup">
                  <li>Sign Up</li>
                </Link>
                <Link to="/login">
                  <li>Login</li>
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile">
                  <li>Profile</li>
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin">
                    <li>Admin</li>
                  </Link>
                )}
                <li onClick={handleLogout}>Logout</li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
