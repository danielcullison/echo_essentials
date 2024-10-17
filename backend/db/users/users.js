const client = require("../client.js");
const bycrypt = require("bcrypt");

const createUser = async (username, password, email) => {
  try {
    const hashedPassword = await bycrypt.hash(password, 10);
    await client.query(
      `
        INSERT INTO users (username, password, email)
        VALUES ($1, $2, $3);
    `,
      [username, hashedPassword, email]
    );

    return { success: true };
  } catch (error) {
    console.error("ERROR CREATING USER: ", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createUser: createUser,
};
