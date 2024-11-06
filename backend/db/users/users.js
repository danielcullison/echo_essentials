// Importing necessary dependencies
const client = require("../client.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10; // Salt rounds for bcrypt hashing
const JWT_SECRET = process.env.JWT || "shhh"; // JWT secret for token generation

const createUser = async (username, password, email, role = "user") => {
  try {
    // Ensure all required fields are provided
    if (!username || !password || !email) {
      return { success: false, error: "All fields are required." };
    }

    // Hash the password to store it securely in the database
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert the new user into the database
    const { rows } = await client.query(
      `
      INSERT INTO users (username, password, email, role)
      VALUES ($1, $2, $3, $4) RETURNING *;
      `,
      [username, hashedPassword, email, role]
    );

    // Return the created user details
    return { success: true, user: rows[0] };
  } catch (error) {
    console.error("ERROR CREATING USER: ", error);

    // Check for duplicate key error (PostgreSQL unique constraint violation)
    if (error.code === '23505') {
      const detail = error.detail || '';

      // Check for username uniqueness violation
      if (detail.includes('Key (username)')) {
        return { success: false, error: 'Username already exists. Please choose a different username.' };
      }

      // Check for email uniqueness violation
      if (detail.includes('Key (email)')) {
        return { success: false, error: 'Email is already in use. Please use a different email address.' };
      }
    }

    // Generic error handling for any other errors
    return { success: false, error: 'An unexpected error occurred while creating the user.' };
  }
};

/**
 * Authenticate a user by verifying their username and password.
 * @param {Object} credentials - The user's login credentials (username and password).
 * @returns {Object} - The result of the authentication (success or error) and JWT token if successful.
 */
const authenticate = async ({ username, password }) => {
  try {
    // Query the database for the user with the provided username
    const { rows } = await client.query(
      `
        SELECT id, username, password, email, role
        FROM users
        WHERE username = $1
      `,
      [username]
    );

    // If no user is found, return an unauthorized error
    if (!rows.length) {
      return { success: false, error: "Not authorized" };
    }

    const user = rows[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: "Not authorized" };
    }

    // Generate a JWT token if authentication is successful
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return the JWT token and user information
    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("AUTHENTICATION ERROR: ", error);
    return { success: false, error: "Authentication failed" };
  }
};

/**
 * Find a user based on their JWT token.
 * @param {string} token - The JWT token.
 * @returns {Object} - The result of the token verification and user retrieval.
 */
const findUserWithToken = async (token) => {
  let id;
  try {
    // Verify the JWT token and extract the user ID
    const payload = jwt.verify(token, JWT_SECRET);
    id = payload.id; // Extract the user ID from the payload
  } catch (ex) {
    // If token verification fails, return an unauthorized error
    return { success: false, error: "Not authorized" };
  }

  // Query the database for the user by ID
  const SQL = `
    SELECT id, username, email, role
    FROM users
    WHERE id = $1
  `;
  const response = await client.query(SQL, [id]);

  // If no user is found, return an unauthorized error
  if (!response.rows.length) {
    return { success: false, error: "Not authorized" };
  }

  // Return the user's details
  return {
    success: true,
    user: {
      id: response.rows[0].id,
      username: response.rows[0].username,
      email: response.rows[0].email,
      role: response.rows[0].role,
    },
  };
};

/**
 * Fetch the user's info based on their ID.
 * @param {number} user_id - The user's ID.
 * @returns {Object} - The user's information (username, email).
 */
const getUserInfo = async (user_id) => {
  const { rows } = await client.query(
    `SELECT id, username, email
     FROM users 
     WHERE id = $1`,
    [user_id]
  );

  return rows[0]; // Return the user's info
};

/**
 * Update a user's information (username, email, password).
 * @param {number} user_id - The ID of the user to update.
 * @param {Object} data - The updated user data (username, email, password).
 * @returns {Object} - The updated user details.
 */
const updateUserInfo = async (user_id, { username, email, password }) => {
  const updates = [];
  const values = [];

  // Check and prepare update fields
  if (username) {
    updates.push(`username = $${updates.length + 1}`);
    values.push(username);
  }

  if (email) {
    updates.push(`email = $${updates.length + 1}`);
    values.push(email);
  }

  if (password) {
    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    updates.push(`password = $${updates.length + 1}`);
    values.push(hashedPassword);
  }

  // If no fields to update, return null
  if (updates.length === 0) {
    return null; // No fields to update
  }

  // Execute the update query
  const result = await client.query(
    `UPDATE users
     SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${updates.length + 1}
     RETURNING id, username, email, created_at, updated_at`,
    [...values, user_id]
  );

  return result.rows[0]; // Return the updated user object
};

/**
 * Fetch all users from the database.
 * @returns {Object} - The list of all users.
 */
const getUsers = async () => {
  try {
    // Query the database to fetch all users
    const { rows } = await client.query(`
      SELECT id, username, email, created_at, updated_at 
      FROM users
      ORDER BY created_at DESC;
    `);
    // Return the list of users
    return { success: true, users: rows };
  } catch (error) {
    console.error("ERROR FETCHING USERS: ", error);
    return { success: false, error: error.message };
  }
};

// Export the functions to be used in other modules
module.exports = {
  createUser,
  authenticate,
  findUserWithToken,
  getUserInfo,
  updateUserInfo,
  getUsers,
};
