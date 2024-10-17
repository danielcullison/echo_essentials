const client = require("../client.js");

const createCategory = async (name) => {
  try {
    await client.query(
      `
            INSERT INTO categories (name)
            VALUES ($1);
        `,
      [name]
    );
    return { success: true };
  } catch (error) {
    console.error("ERROR CREATING CATEGORY: ", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createCategory: createCategory,
};
