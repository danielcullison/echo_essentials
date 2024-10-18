const client = require("../client.js");

/**
 * Create a new order in the database.
 * @param {number} user_id - The ID of the user placing the order.
 * @param {number} total_amount - The total amount for the order.
 * @param {string} status - The current status of the order (e.g., "pending", "completed").
 * @returns {object} - Result of the operation, indicating success or an error message.
 */
const createOrder = async (user_id, total_amount, status) => {
  try {
    // Insert the new order into the orders table
    await client.query(
      `
        INSERT INTO orders (user_id, total_amount, status)
        VALUES ($1, $2, $3);
      `,
      [user_id, total_amount, status] // Values for the query placeholders
    );
    // Return success status if the operation is successful
    return { success: true };
  } catch (error) {
    console.error("ERROR CREATING ORDER: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

// Export the createOrder function to be used in other modules
module.exports = {
  createOrder,
};
