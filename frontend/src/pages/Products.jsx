import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Products.css";
import { useAuth } from '../context/AuthContext'; // Assuming you're using context for auth
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Access the authenticated user

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    if (!user) {
      alert("You must be logged in to add items to the cart.");
      return;
    }

    const product = products.find(p => p.id === productId);
    const productName = product ? product.name : "Product";

    try {
      await axios.post('http://localhost:3000/api/cart', {
        product_id: productId,
        quantity: 1,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Include auth token
        },
      });

      alert(`${productName} added to your cart!`);
    } catch (err) {
      console.error('Error adding item to cart:', err);
      alert('Could not add item to cart. Please try again.');
    }
  };

  if (loading) {
    return <div className="products-loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="products-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h1 className="products-title">PRODUCTS</h1>
      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className="products-card">
            <Link to={`/products/${product.id}`} className="products-link">
              <img
                src={product.image_url || "placeholder.jpg"}
                alt={product.name}
                className="products-image"
              />
              <h2 className="products-name">{product.name}</h2>
              <p className="products-price">{`$${product.price.toFixed(2)}`}</p>
            </Link>
            <button className="products-add-to-cart" onClick={() => addToCart(product.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
