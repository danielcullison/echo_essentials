const client = require("../client.js");

const createCart = async (user_id, product_id, quantity) => {
  try {
    await client.query(
      `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES ($1, $2, $3);
    `,
      [user_id, product_id, quantity]
    );
    return { success: true };
  } catch (error) {
    console.error("ERROR CREATING CART: ", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createCart: createCart,
};
