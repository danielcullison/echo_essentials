import React from "react";
import { Link } from "react-router-dom"; // Import Link component from react-router-dom to enable navigation between pages
import "../styles/Home.css"; // Import CSS styles for the home page

const Home = () => {
  return (
    <div className="home-container"> {/* Main container for the home page */}
      <h1 className="home-title">Find Your Rhythm.</h1> {/* Heading to showcase the page's theme or message */}
      
      {/* Link to navigate to the products page */}
      <Link to="/products"> 
        {/* Button that redirects to the products page */}
        <button className="shop-now">
          Shop Now
        </button>
      </Link>
    </div>
  );
};

export default Home;
