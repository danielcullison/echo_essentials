import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Importing auth context to get user data
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation
import "../styles/Cart.css"; // Importing CSS styles for the cart page

const Cart = () => {
  const { user } = useAuth(); // Access user data from AuthContext
  const [cartItems, setCartItems] = useState([]); // State to hold items in the cart
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to handle error messages
  
  const navigate = useNavigate(); // Initialize the navigate function for routing

  // Fetch the cart items when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setError("You must be logged in to view the cart.");
        setLoading(false);
        return;
      }

      try {
        // Send request to fetch cart items for the logged-in user
        const response = await axios.get("http://localhost:3000/api/cart", {
          headers: { Authorization: `Bearer ${user.token}` }, // Include token for authorization
        });

        // Ensure that the response contains an array of cart items
        const fetchedCartItems = Array.isArray(response.data.cart.cart)
          ? response.data.cart.cart
          : [];

        // Update the state with the fetched cart items
        setCartItems(fetchedCartItems);
      } catch (err) {
        setError(err.response ? err.response.data.error : "Error fetching cart");
      } finally {
        setLoading(false); // Set loading to false once data is fetched or error occurs
      }
    };

    fetchCart(); // Call the function to fetch cart items
  }, [user]); // Only run this effect when the `user` state changes

  // Calculate the total amount of the items in the cart
  const calculateTotalAmount = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Create a new order based on the current cart items
  const createOrder = async () => {
    if (!user) return;

    const totalAmount = calculateTotalAmount(); // Get the total amount from the cart

    try {
      // Send request to create an order
      const response = await axios.post(
        "http://localhost:3000/api/orders",
        {
          user_id: user.id,
          total_amount: totalAmount,
          status: "pending",
        },
        {
          headers: { Authorization: `Bearer ${user.token}` }, // Include token for authorization
        }
      );

      // Check for a successful response and clear the cart
      if (response.data.message === "Order created successfully.") {
        setCartItems([]); // Empty the cart after successful order creation
        alert("Order created successfully!"); // Notify user
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      setError("Error creating order: " + (error.response ? error.response.data.error : error.message));
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!user || newQuantity < 1) {
      console.log("Invalid user or quantity is less than 1");
      return; // Ensure valid quantity and user is logged in
    }
    
    try {
      // Log the request URL and headers
      const url = `http://localhost:3000/api/cart/${productId}`;
  
      // Send request to update the cart item quantity
      const response = await axios.put(url, { quantity: newQuantity }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
  
      // Update the cart item in the local state after successful response
      const updatedItem = response.data;
  
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: updatedItem.quantity }
            : item
        )
      );
    } catch (err) {
      console.error("Error in updating item:", err); // Log the error object
      // If the error has a response, log it
      if (err.response) {
        console.error("Error response from server:", err.response);
      }
      setError("Error updating item. Please try again.");
    }
  };

  // Remove an item from the cart
  const removeItem = async (productId) => {
    if (!user) return; // Ensure user is logged in

    try {
      // Send request to delete the cart item
      await axios.delete(`http://localhost:3000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // Remove the item from the local cart state
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product_id !== productId)
      );
    } catch (err) {
      setError("Error removing item. Please try again.");
    }
  };

  // Add an item to the cart
  const addToCart = async (productId, quantity) => {
    if (!user) return; // Ensure user is logged in
    try {
      // Send request to add the item to the cart
      const response = await axios.post(
        "http://localhost:3000/api/cart",
        { product_id: productId, quantity },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      // Add the newly added item to the cart
      setCartItems((prevItems) => [
        ...prevItems,
        { ...response.data, quantity },
      ]);
    } catch (err) {
      setError("Error adding item to cart. Please try again.");
    }
  };

  // Display loading spinner or error message while data is being fetched or if there's an error
  if (loading) return <p className="cart-loading">Loading...</p>;
  if (error) return <p className="cart-error">{error}</p>;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      
      {/* If cart is empty, show a message */}
      {Array.isArray(cartItems) && cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        // Display cart items if available
        <ul className="cart-item-list">
          {cartItems.map((item) => (
            <li key={item.product_id} className="cart-item">
              <h3 className="cart-item-name">{item.product_name}</h3>
              <img
                src={item.image_url}
                alt={item.product_name}
                className="cart-item-image"
              />
              <p className="cart-item-price">Price: ${item.price}</p>
              
              {/* Input for changing the quantity */}
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
              
              {/* Button to remove the item */}
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

      {/* Display the cart total */}
      {cartItems.length > 0 && (
        <div className="cart-total">
          <h3>Total: ${calculateTotalAmount().toFixed(2)}</h3>
        </div>
      )}
      <div className="cart-button-wrapper">
      {/* Checkout button */}
      <button onClick={createOrder} className="cart-checkout-button">
        Check Out
      </button>

      {/* Continue shopping button */}
      <button
        onClick={() => navigate("/products")} // Navigate to products page
        className="cart-continue-shopping-button"
      >
        Continue Shopping
      </button>
      </div>
    </div>
  );
};

export default Cart;
