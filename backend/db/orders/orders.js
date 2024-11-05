// Importing the database client to interact with PostgreSQL
const client = require("../client.js");

/**
 * Create a new order for a user in the orders table.
 * @param {number} user_id - The ID of the user placing the order.
 * @param {number} total_amount - The total amount for the order.
 * @param {string} status - The status of the order (e.g., "pending", "completed").
 * @returns {Object} - The result of the operation (success or error) and the new order's ID.
 */
const createOrder = async (user_id, total_amount, status) => {
  try {
    // Insert a new order into the orders table
    const result = await client.query(
      `
      INSERT INTO orders (user_id, total_amount, status)
      VALUES ($1, $2, $3) RETURNING id;
      `,
      [user_id, total_amount, status] // Query parameters
    );

    // Return the success status along with the created order's ID
    return { success: true, orderId: result.rows[0].id };
  } catch (error) {
    console.error("ERROR CREATING ORDER: ", error);
    // Return error information if the operation fails
    return { success: false, error: error.message };
  }
};

/**
 * Get all orders for a specific user.
 * @param {number} user_id - The ID of the user to retrieve orders for.
 * @returns {Array} - The list of orders for the user.
 */
const getOrders = async (user_id) => {
  try {
    // Query the database for orders belonging to the specified user
    const { rows } = await client.query(
      `SELECT * FROM orders
       WHERE user_id = $1
       ORDER BY order_date DESC`,
      [user_id]
    );

    return rows; // Return the list of orders for the user
  } catch (error) {
    console.error("ERROR FETCHING USER ORDERS: ", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all orders from all users (admin access).
 * @returns {Object} - The result of the operation (success or error) with the list of all orders.
 */
const getAllOrders = async () => {
  try {
    // Query the database to fetch all orders
    const { rows } = await client.query(`
      SELECT id, user_id, total_amount, status, order_date, updated_at 
      FROM orders
      ORDER BY order_date DESC;
    `);

    // Return success status and the list of all orders
    return { success: true, orders: rows };
  } catch (error) {
    console.error("ERROR FETCHING ALL ORDERS: ", error);
    // Return error information if fetching fails
    return { success: false, error: error.message };
  }
};

// Exporting the functions to be used in other parts of the application
module.exports = {
  createOrder,
  getOrders,
  getAllOrders,
};
