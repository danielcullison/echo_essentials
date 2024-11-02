import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
          setProduct(data.item); // Updated to match API response structure
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
          <button className="product-details-add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
