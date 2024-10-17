const client = require("../client.js");

const createOrder = async (user_id, total_amount, status) => {
  try {
    await client.query(
      `
        INSERT INTO orders (user_id, total_amount, status)
        VALUES ($1, $2, $3);
    `,
      [user_id, total_amount, status]
    );
    return { success: true };
  } catch (error) {
    console.error("ERROR CREATING ORDER: ", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createOrder: createOrder,
};
