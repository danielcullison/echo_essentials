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
    // Insert a new entry into the cart table for the specified user and product
    await client.query(
      `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES ($1, $2, $3);
    `,
      [user_id, product_id, quantity] // Values for the query placeholders
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
      SELECT * FROM cart
      WHERE user_id = $1;
    `,
      [user_id]
    );
    return { success: true, cart: rows };
  } catch (error) {
    console.error("ERROR FETCHING CART: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

// Export the createCart function to be used in other modules
module.exports = {
  createCart,
  getCart,
};
