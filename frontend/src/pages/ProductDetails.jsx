import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useParams for accessing route parameters and useNavigate for page navigation
import "../styles/ProductDetails.css"; // Import the styles for the product details page
import { useAuth } from "../context/AuthContext"; // Import the auth context for user info (login status and token)
import axios from "axios"; // Import axios for making HTTP requests

const ProductDetails = () => {
  const { id } = useParams(); // Get the product id from the URL parameters
  const navigate = useNavigate(); // useNavigate hook to navigate between pages programmatically
  const { user } = useAuth(); // Access the authenticated user from context
  const [product, setProduct] = useState(null); // State to store the fetched product details
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle any error messages

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch product data from the backend API
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok"); // Error handling for failed network response
        }
        const data = await response.json();
        if (data.success) {
          setProduct(data.item); // Store product data in state if successful
        } else {
          throw new Error("Failed to fetch product"); // Handle failed API response
        }
      } catch (error) {
        setError(error.message); // Set error state if an exception occurs
      } finally {
        setLoading(false); // Set loading to false once the fetch operation is complete
      }
    };

    fetchProduct(); // Invoke the fetchProduct function when the component mounts
  }, [id]); // Dependency array ensures effect is called whenever the product ID changes

  // Function to add product to cart
  const addToCart = async () => {
    if (!user) {
      alert("You must be logged in to add items to the cart."); // Ensure the user is logged in
      return;
    }

    const productName = product ? product.name : "Product"; // Get the product name (or fallback to "Product")

    try {
      // Send a POST request to add the product to the user's cart
      await axios.post(
        "http://localhost:3000/api/cart",
        {
          product_id: id, // Product ID from URL
          quantity: 1, // Set initial quantity to 1
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Include auth token for the logged-in user
          },
        }
      );
      alert(`${productName} added to your cart!`); // Show success message
    } catch (err) {
      console.error("Error adding item to cart:", err); // Log error for debugging
      alert("Could not add item to cart. Please try again."); // Display error message
    }
  };

  // Loading state rendering
  if (loading) {
    return <div className="product-details-loading">Loading...</div>; // Display loading message while fetching product data
  }

  // Error state rendering
  if (error) {
    return <div className="product-details-error">Error: {error}</div>; // Display error message if an error occurs
  }

  // If no product is found, display a message
  if (!product) {
    return <div className="product-details-error">Product not found</div>; // Display a fallback message if product is null
  }

  // Main rendering of product details page
  return (
    <div className="product-details-container">
      {/* Back button to navigate to the previous page */}
      <button
        onClick={() => navigate(-1)} // Navigate to the previous page
        className="product-details-back-button"
      >
        ← Back to Products
      </button>

      <div className="product-details-content">
        {/* Product image */}
        <div className="product-details-image">
          <img
            src={product.image_url || "placeholder.jpg"} // Fallback to placeholder if no image URL is available
            alt={product.name} // Set alt text to product name
            className="product-details-image-img"
          />
        </div>

        <div className="product-details-info">
          {/* Product name */}
          <h1 className="product-details-name">{product.name}</h1>
          {/* Product price */}
          <p className="product-details-price">${product.price.toFixed(2)}</p>
          {/* Product description */}
          <p className="product-details-description">{product.description}</p>
          
          {/* Button to add product to cart */}
          <button
            className="product-details-add-to-cart"
            onClick={addToCart} // Trigger addToCart function on click
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
