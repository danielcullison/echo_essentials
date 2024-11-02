const client = require("../client.js");

/**
 * Create a new cart entry in the database for a user.
 * @param {number} user_id - The ID of the user creating the cart entry.
 * @param {number} product_id - The ID of the product to be added to the cart.
 * @param {number} quantity - The quantity of the product to be added.
 * @returns {object} - Result of the operation, indicating success or an error message.
 */
const createCart = async (user_id, product_id, quantity) => {
  try {
    // Ensure inputs are integers
    const userId = parseInt(user_id, 10);
    const productId = parseInt(product_id, 10);
    const qty = parseInt(quantity, 10);

    // Validate inputs
    if (isNaN(userId) || isNaN(productId) || isNaN(qty)) {
      throw new Error(
        "Invalid input: user_id, product_id, and quantity must be numbers."
      );
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

const getCart = async (user_id) => {
  try {
    const { rows } = await client.query(
      `
      SELECT cart.*, products.name AS product_name, products.description, products.price, products.image_url
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.user_id = $1;
    `,
      [user_id]
    );
    return { success: true, cart: rows };
  } catch (error) {
    console.error("ERROR FETCHING CART: ", error);
    return { success: false, error: error.message };
  }
};

const updateCartItem = async (user_id, product_id, { quantity }) => {
  console.log(`Updating cart item for user: ${user_id}, product: ${product_id}, quantity: ${quantity}`);
  const result = await client.query(
    `UPDATE cart
     SET quantity = $1, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $2 AND product_id = $3
     RETURNING *`,
    [quantity, user_id, product_id]
  );

  return result.rows[0]; // Return the updated cart item
};

// Function to delete a cart item
const deleteCartItem = async (user_id, product_id) => {
  try {
    const result = await client.query(
      `DELETE FROM cart
       WHERE user_id = $1 AND product_id = $2
       RETURNING *`,
      [user_id, product_id]
    );

    if (result.rowCount === 0) {
      console.log(`No item found for user_id: ${user_id} and product_id: ${product_id}`);
      return false; // No rows deleted
    }

    return true; // Item was deleted successfully
  } catch (error) {
    console.error("ERROR DELETING CART ITEM: ", error);
    throw new Error("Failed to delete cart item");
  }
};


// Export the createCart function to be used in other modules
module.exports = {
  createCart,
  getCart,
  updateCartItem,
  deleteCartItem,
};
