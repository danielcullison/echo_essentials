import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Cart.css";

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setError("You must be logged in to view the cart.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/api/cart", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const fetchedCartItems = Array.isArray(response.data.cart.cart)
          ? response.data.cart.cart
          : [];
        setCartItems(fetchedCartItems);
      } catch (err) {
        setError(
          err.response ? err.response.data.error : "Error fetching cart"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const calculateTotalAmount = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const createOrder = async () => {
    if (!user) return;

    const totalAmount = calculateTotalAmount();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/orders",
        {
          user_id: user.id,
          total_amount: totalAmount,
          status: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Log the response data
      console.log(response.data);

      // Check the response message instead of a success flag
      if (response.data.message === "Order created successfully.") {
        setCartItems([]);
        alert("Order created successfully!");
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      setError(
        "Error creating order: " +
          (error.response ? error.response.data.error : error.message)
      );
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!user || newQuantity < 1) return;

    try {
      const response = await axios.put(
        `http://localhost:3000/api/cart/${productId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const updatedItem = response.data;

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: updatedItem.quantity }
            : item
        )
      );
    } catch (err) {
      setError("Error updating item. Please try again.");
    }
  };

  const removeItem = async (productId) => {
    if (!user) return;

    try {
      await axios.delete(`http://localhost:3000/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product_id !== productId)
      );
    } catch (err) {
      setError("Error removing item. Please try again.");
    }
  };

  const addToCart = async (productId, quantity) => {
    if (!user) return;
    try {
      const response = await axios.post(
        "http://localhost:3000/api/cart",
        { product_id: productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setCartItems((prevItems) => [
        ...prevItems,
        { ...response.data, quantity },
      ]);
    } catch (err) {
      setError("Error adding item to cart. Please try again.");
    }
  };

  if (loading) return <p className="cart-loading">Loading...</p>;
  if (error) return <p className="cart-error">{error}</p>;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      {Array.isArray(cartItems) && cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <ul className="cart-item-list">
          {cartItems.map((item) => (
            <li key={item.product_id} className="cart-item">
              <h3 className="cart-item-name">{item.product_name}</h3>
              <img
                src={item.image_url}
                alt={item.product_name}
                className="cart-item-image"
              />
              <p className="cart-item-description">{item.description}</p>
              <p className="cart-item-price">Price: ${item.price}</p>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = Number(e.target.value);
                  if (newQuantity > 0) {
                    updateQuantity(item.product_id, newQuantity);
                  }
                }}
                min="1"
                className="cart-item-quantity"
              />
              <button
                onClick={() => removeItem(item.product_id)}
                className="cart-item-remove-button"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={createOrder} className="cart-checkout-button">
        Check Out
      </button>
    </div>
  );
};

export default Cart;
