const express = require("express");
const {
  getCart,
  createCart,
  updateCartItem,
  deleteCartItem,
} = require("../db/cart/cart.js");
const { isLoggedIn } = require("../middleware/auth");

const router = express.Router();

// Route to retrieve the logged-in user's cart
router.get("/", isLoggedIn, async (req, res) => {
  const { user } = req.user; // Extract user info from the request
  try {
    const cart = await getCart(user.id);
    res.json({ cart }); // Return the cart in a structured format
  } catch (error) {
    console.error("ERROR FETCHING CART: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to create a cart item
router.post("/", isLoggedIn, async (req, res) => {
  const { product_id, quantity } = req.body;
  const { user } = req.user;
  
  console.log("user", user);
  try {
    const cartItem = await createCart(user.id, product_id, quantity);
    res.status(201).json(cartItem); // Return the created cart item
  } catch (error) {
    console.error("ERROR ADDING ITEM TO CART: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to update an item in the cart
router.put("/:product_id", isLoggedIn, async (req, res) => {
  const { product_id } = req.params;
  const { quantity } = req.body;

  // Validate the quantity
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Invalid quantity.' });
  }

  try {
    const updatedCartItem = await updateCartItem(req.user.id, product_id, { quantity });

    // Check if the item was successfully updated
    if (!updatedCartItem) {
      return res.status(404).json({ error: 'Cart item not found or update failed.' });
    }

    res.json(updatedCartItem); // Return the updated cart item
  } catch (error) {
    console.error("ERROR UPDATING CART ITEM: ", error.message); // Log only the message
    res.status(500).json({ error: 'An error occurred while updating the cart item.' });
  }
});


// Route to remove an item from the cart
router.delete("/:product_id", isLoggedIn, async (req, res) => {
  const { product_id } = req.params;
  const userId = req.user.user.id; // Ensure this is the correct path to user ID

  console.log('Deleting item for user ID:', userId, 'and product ID:', product_id); // Log for debugging
  try {
    await deleteCartItem(userId, product_id);
    res.status(204).send(); // No content to return
  } catch (error) {
    console.error("ERROR DELETING CART ITEM: ", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
