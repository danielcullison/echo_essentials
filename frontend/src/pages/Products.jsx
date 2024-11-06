import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link to navigate between pages
import "../styles/Products.css"; // Import the stylesheet for the products page
import { useAuth } from '../context/AuthContext'; // Import context for user authentication
import axios from 'axios'; // Import axios for making HTTP requests

const Products = () => {
  const [products, setProducts] = useState([]); // State to store fetched products
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage errors
  const { user } = useAuth(); // Access the authenticated user (from context)

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.success) {
          setProducts(data.products); // Set fetched products to the state
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (error) {
        setError(error.message); // Set error state if the request fails
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchProducts(); // Invoke the function to fetch products
  }, []); // Empty dependency array means this effect runs only once (when the component mounts)

  // Add product to cart
  const addToCart = async (productId) => {
    if (!user) {
      alert("You must be logged in to add items to the cart."); // Ensure user is logged in before adding to cart
      return;
    }

    // Find the product by its ID
    const product = products.find(p => p.id === productId);
    const productName = product ? product.name : "Product";

    try {
      // Send POST request to add the product to the user's cart
      await axios.post('http://localhost:3000/api/cart', {
        product_id: productId,
        quantity: 1, // Default quantity is 1
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Include the user token for authentication
        },
      });

      // Notify user of the successful addition to cart
      alert(`${productName} added to your cart!`);
    } catch (err) {
      console.error('Error adding item to cart:', err); // Log any error to the console
      alert('Could not add item to cart. Please try again.'); // Display error message to user
    }
  };

  // If data is still loading, display loading message
  if (loading) {
    return <div className="products-loading">Loading...</div>;
  }

  // If there's an error fetching data, display error message and allow retry
  if (error) {
    return (
      <div className="products-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button> {/* Button to retry fetching */}
      </div>
    );
  }

  // Render products if they are fetched successfully
  return (
    <div className="products-container">
      <h1 className="products-title">PRODUCTS</h1>
      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className="products-card">
            {/* Link to navigate to the product details page */}
            <Link to={`/products/${product.id}`} className="products-link">
              <img
                src={product.image_url || "placeholder.jpg"} // Fallback to placeholder image if image_url is missing
                alt={product.name} // Alt text for the image
                className="products-image"
              />
              <h2 className="products-name">{product.name}</h2>
              <p className="products-price">{`$${product.price.toFixed(2)}`}</p>
            </Link>
            {/* Button to add the product to the cart */}
            <button className="products-add-to-cart" onClick={() => addToCart(product.id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
