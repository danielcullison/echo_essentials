const client = require("../client.js");

const createProduct = async (
  name,
  description,
  price,
  category_id,
  image_url
) => {
  try {
    await client.query(
      `
        INSERT INTO products (name, description, price, category_id, image_url) 
        VALUES ($1, $2, $3, $4, $5);   
    `,
      [name, description, price, category_id, image_url]
    );
    return { success: true };
  } catch (error) {
    console.error("ERROR CREATING PRODUCT: ", error);
    return { success: false, error: error.message };
  }
};

const getProducts = async () => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM products;
    `);
    return { success: true, products: rows };
  } catch (error) {
    console.error("ERROR FETCHING PRODUCTS: ", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createProduct: createProduct,
  getProducts: getProducts,
};
