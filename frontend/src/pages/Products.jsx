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
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/products`);
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

  // Add or update product in cart
  const addToCart = async (productId) => {
    if (!user) {
      alert("You must be logged in to add items to the cart.");
      return;
    }

    // Find the product by its ID
    const product = products.find(p => p.id === productId);
    const productName = product ? product.name : "Product";

    try {
      // Check if the product is already in the cart
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Check if the response data has the expected structure
      if (response.data && response.data.cart && Array.isArray(response.data.cart.cart)) {
        const cartItem = response.data.cart.cart.find(item => item.product_id === productId);

        if (cartItem) {
          // If the product is already in the cart, update the quantity
          await axios.put(
            `${import.meta.env.VITE_APP_API_URL}/api/cart/${cartItem.product_id}`,
            {
              quantity: cartItem.quantity + 1, // Increase the quantity by 1
            },
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          alert(`${productName} quantity updated in your cart!`);
        } else {
          // If the product is not in the cart, add it
          await axios.post(
            `${import.meta.env.VITE_APP_API_URL}/api/cart`,
            {
              product_id: productId,
              quantity: 1, // Default quantity is 1
            },
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          alert(`${productName} added to your cart!`);
        }
      } else {
        console.error("Unexpected response structure for cart:", response.data); // Log if the response structure is unexpected
        alert("Error fetching cart items. Please try again.");
      }
    } catch (err) {
      console.error('Error adding or updating item in cart:', err); // Log the error in case something goes wrong
      alert('Could not add or update item in cart. Please try again.');
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
