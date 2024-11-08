import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import echoEssentialsLogo from "../assets/echoEssentialsLogo.png";
import accountIcon from "../assets/accountIcon.png";
import searchIcon from "../assets/searchIcon.png";
import cartIcon from "../assets/cartIcon.png";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { products } = useProducts();
  const { logout, user } = useAuth();
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isSearchBarVisible, setSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const searchBarRef = useRef(null);
  const userMenuRef = useRef(null);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    setSearchQuery("");
    setFilteredProducts([]);
    setMobileMenuOpen(false);
  };

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
    setMobileMenuOpen(false);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Mobile menu items based on user authentication and role
  const getMobileMenuItems = () => {
    const baseItems = [
      { label: "Home", onClick: () => handleNavigate("/") },
      { label: "Products", onClick: () => handleNavigate("/products") },
      { label: "Cart", onClick: () => handleNavigate("/cart") },
    ];

    if (!user) {
      return [
        ...baseItems,
        { label: "Sign Up", onClick: () => handleNavigate("/signup") },
        { label: "Login", onClick: () => handleNavigate("/login") },
      ];
    }

    const authenticatedItems = [
      ...baseItems,
      { label: "Profile", onClick: () => handleNavigate("/profile") },
      { label: "Logout", onClick: handleLogout },
    ];

    if (user.role === "admin") {
      return [
        ...authenticatedItems.slice(0, -1), // Remove logout temporarily
        { label: "Admin", onClick: () => handleNavigate("/admin") },
        { label: "Logout", onClick: handleLogout }, // Add logout at the end
      ];
    }

    return authenticatedItems;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target) &&
        !event.target.closest(".search-icon")
      ) {
        setSearchBarVisible(false);
        setFilteredProducts([]);
      }

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        !event.target.closest(".account-icon")
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img
            className="logo"
            src={echoEssentialsLogo}
            alt="Echo Essentials Logo"
          />
        </Link>
      </div>

      {/* Desktop Menu */}
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

      {/* Mobile Menu Toggle Button */}
      <button className="mobile-menu-icon" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {getMobileMenuItems().map((item, index) => (
            <div key={index} className="mobile-menu-item" onClick={item.onClick}>
              {item.label}
            </div>
          ))}
        </div>
      )}

      {/* Search Bar */}
      <div
        ref={searchBarRef}
        className={`search-bar ${isSearchBarVisible ? "active" : ""}`}
      >
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

      {/* User Menu (Desktop) */}
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