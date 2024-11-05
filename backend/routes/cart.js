// Importing required modules and functions
const express = require("express");
const {
  getCart,
  createCart,
  updateCartItem,
  deleteCartItem,
} = require("../db/cart/cart.js");
const { isLoggedIn } = require("../middleware/auth");

const router = express.Router();

// Route to get the current user's cart, accessible only by logged-in users
router.get("/", isLoggedIn, async (req, res) => {
  const { user } = req.user; // Get the logged-in user's information
  try {
    const cart = await getCart(user.id); // Fetch the user's cart
    res.json({ cart }); // Return the cart as JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors with a relevant message
  }
});

// Route to add an item to the cart, accessible only by logged-in users
router.post("/", isLoggedIn, async (req, res) => {
  const { product_id, quantity } = req.body; // Destructure product data from request body
  const { user } = req.user; // Get the logged-in user's information

  try {
    const cartItem = await createCart(user.id, product_id, quantity); // Create a new cart item
    res.status(201).json(cartItem); // Return the created cart item
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors with a relevant message
  }
});

// Route to update an item in the cart by product ID, accessible only by logged-in users
router.put("/:product_id", isLoggedIn, async (req, res) => {
  const { product_id } = req.params; // Get product ID from request parameters
  const { quantity } = req.body; // Get updated quantity from request body

  // Validate quantity
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: "Invalid quantity." }); // Handle invalid quantity
  }

  try {
    const updatedCartItem = await updateCartItem(req.user.id, product_id, { quantity }); // Update the cart item

    if (!updatedCartItem) {
      return res.status(404).json({ error: "Cart item not found or update failed." }); // Handle item not found
    }

    res.json(updatedCartItem); // Return updated cart item
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the cart item." }); // Handle unexpected errors
  }
});

// Route to delete an item from the cart by product ID, accessible only by logged-in users
router.delete("/:product_id", isLoggedIn, async (req, res) => {
  const { product_id } = req.params; // Get product ID from request parameters
  const userId = req.user.user.id; // Get the logged-in user's ID

  try {
    await deleteCartItem(userId, product_id); // Attempt to delete the cart item
    res.status(204).send(); // No content response for successful deletion
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors with a relevant message
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
