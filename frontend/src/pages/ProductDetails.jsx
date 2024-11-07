import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetails.css";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.success) {
          setProduct(data.item);
        } else {
          throw new Error("Failed to fetch product");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      alert("You must be logged in to add items to the cart.");
      return;
    }

    const productName = product ? product.name : "Product";
    console.log("Adding to cart for product:", product);
    console.log("Product ID:", id); // Log the product ID we're working with

    try {
      // First, check if the product is already in the cart
      const cartResponse = await axios.get('http://localhost:3000/api/cart', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      console.log("Cart response data:", cartResponse.data);

      // Make sure we're accessing the cart items correctly
      const cartItems = cartResponse.data?.cart?.cart || [];
      
      // Convert IDs to strings for comparison
      const cartItem = cartItems.find(item => String(item.product_id) === String(id));
      console.log("Found cart item:", cartItem);

      if (cartItem) {
        console.log("Updating existing cart item with PUT request");
        // Update existing item
        const updateResponse = await axios.put(
          `http://localhost:3000/api/cart/${id}`, // Using the product ID directly
          {
            quantity: cartItem.quantity + 1,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log("Update response:", updateResponse);
        alert(`${productName} quantity updated in your cart!`);
      } else {
        console.log("Adding new item with POST request");
        // Add new item
        const addResponse = await axios.post(
          'http://localhost:3000/api/cart',
          {
            product_id: id,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log("Add response:", addResponse);
        alert(`${productName} added to your cart!`);
      }
    } catch (err) {
      console.error('Error adding or updating item in cart:', err);
      console.error('Error details:', err.response?.data);
      alert('Could not add or update item in cart. Please try again.');
    }
  };

  if (loading) {
    return <div className="product-details-loading">Loading...</div>;
  }

  if (error) {
    return <div className="product-details-error">Error: {error}</div>;
  }

  if (!product) {
    return <div className="product-details-error">Product not found</div>;
  }

  return (
    <div className="product-details-container">
      <button
        onClick={() => navigate(-1)}
        className="product-details-back-button"
      >
        ← Back to Products
      </button>

      <div className="product-details-content">
        <div className="product-details-image">
          <img
            src={product.image_url || "placeholder.jpg"}
            alt={product.name}
            className="product-details-image-img"
          />
        </div>

        <div className="product-details-info">
          <h1 className="product-details-name">{product.name}</h1>
          <p className="product-details-price">${product.price.toFixed(2)}</p>
          <p className="product-details-description">{product.description}</p>
          
          <button
            className="product-details-add-to-cart"
            onClick={addToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;