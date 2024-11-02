import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css"; // Import the CSS file

const Home = () => {
  return (
    <div className="home-container"> {/* Add class for styling */}
      <h1 className="home-title">Find Your Rhythm.</h1>
      <Link to="/products">
        <button className="shop-now">
          Shop Now
        </button>
      </Link>
    </div>
  );
};

export default Home;
