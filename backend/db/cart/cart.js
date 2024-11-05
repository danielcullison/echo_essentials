// Importing the database client to interact with PostgreSQL
const client = require("../client.js");

/**
 * Create a new cart entry for the user with a specified product and quantity.
 * @param {number} user_id - The ID of the user.
 * @param {number} product_id - The ID of the product.
 * @param {number} quantity - The quantity of the product in the cart.
 * @returns {Object} - The result of the operation (success or error).
 */
const createCart = async (user_id, product_id, quantity) => {
  try {
    // Ensure inputs are integers
    const userId = parseInt(user_id, 10);
    const productId = parseInt(product_id, 10);
    const qty = parseInt(quantity, 10);

    // Validate inputs
    if (isNaN(userId) || isNaN(productId) || isNaN(qty)) {
      throw new Error("Invalid input: user_id, product_id, and quantity must be numbers.");
    }

    // Insert a new entry into the cart table for the specified user and product
    await client.query(
      `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES ($1, $2, $3);
      `,
      [userId, productId, qty] // Values for the query placeholders
    );

    // Return success status if the operation is successful
    return { success: true };
  } catch (error) {
    console.error("ERROR CREATING CART: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

/**
 * Retrieve the cart for a specific user, including product details.
 * @param {number} user_id - The ID of the user whose cart is being retrieved.
 * @returns {Object} - The result of the operation (success with cart or error).
 */
const getCart = async (user_id) => {
  try {
    // Query to fetch the cart items along with product details for the user
    const { rows } = await client.query(
      `
      SELECT cart.*, products.name AS product_name, products.description, products.price, products.image_url
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.user_id = $1;
    `,
      [user_id] // User ID for which the cart is being fetched
    );

    // Return the retrieved cart items
    return { success: true, cart: rows };
  } catch (error) {
    console.error("ERROR FETCHING CART: ", error);
    return { success: false, error: error.message };
  }
};

/**
 * Update the quantity of a specific item in the user's cart.
 * @param {number} user_id - The ID of the user.
 * @param {number} product_id - The ID of the product to update.
 * @param {Object} quantity - The new quantity for the product.
 * @returns {Object} - The updated cart item or null if update failed.
 */
const updateCartItem = async (user_id, product_id, { quantity }) => {
  try {
    // Query to update the quantity of the specified cart item
    const result = await client.query(
      `UPDATE cart
       SET quantity = $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2 AND product_id = $3
       RETURNING *`,
      [quantity, user_id, product_id]
    );

    // Return the updated cart item if the query was successful
    return result.rows[0];
  } catch (error) {
    console.error("ERROR UPDATING CART ITEM: ", error);
    throw new Error("Failed to update cart item");
  }
};

/**
 * Delete an item from the user's cart.
 * @param {number} user_id - The ID of the user.
 * @param {number} product_id - The ID of the product to remove.
 * @returns {boolean} - Whether the item was deleted successfully or not.
 */
const deleteCartItem = async (user_id, product_id) => {
  try {
    // Query to delete the cart item for the specified user and product
    const result = await client.query(
      `DELETE FROM cart
       WHERE user_id = $1 AND product_id = $2
       RETURNING *`,
      [user_id, product_id]
    );

    // If no rows were affected, the item doesn't exist in the cart
    if (result.rowCount === 0) {
      console.log(`No item found for user_id: ${user_id} and product_id: ${product_id}`);
      return false; // No rows deleted
    }

    // Return true if the item was deleted successfully
    return true;
  } catch (error) {
    console.error("ERROR DELETING CART ITEM: ", error);
    throw new Error("Failed to delete cart item");
  }
};

// Export the functions to be used in other parts of the application
module.exports = {
  createCart,
  getCart,
  updateCartItem,
  deleteCartItem,
};
