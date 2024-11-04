const client = require("../client.js");

const createOrder = async (user_id, total_amount, status) => {
  try {
    const result = await client.query(
      `
      INSERT INTO orders (user_id, total_amount, status)
      VALUES ($1, $2, $3) RETURNING id;
      `,
      [user_id, total_amount, status]
    );

    return { success: true, orderId: result.rows[0].id };
  } catch (error) {
    console.error("ERROR CREATING ORDER: ", error);
    return { success: false, error: error.message };
  }
};

const getOrders = async (user_id) => {
  const { rows } = await client.query(
    `SELECT * FROM orders
     WHERE user_id = $1
     ORDER BY order_date DESC`,
    [user_id]
  );

  return rows; // Return the array of orders
};

const getAllOrders = async () => {
  try {
    // Query the database to fetch all orders
    const { rows } = await client.query(`
      SELECT id, user_id, total_amount, status, order_date, updated_at 
      FROM orders
      ORDER BY order_date DESC;
    `);
    // Return success status and the list of orders
    return { success: true, orders: rows };
  } catch (error) {
    console.error("ERROR FETCHING ORDERS: ", error);
    // Return error information if fetching fails
    return { success: false, error: error.message };
  }
};

// Export the createOrder function to be used in other modules
module.exports = {
  createOrder,
  getOrders,
  getAllOrders
};
