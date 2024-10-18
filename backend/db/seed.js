const client = require("./client.js");
const { createUser } = require("./users/users.js");
const { createCategory } = require("./categories/categories.js");
const { createProduct } = require("./products/products.js");
const { createOrder } = require("./orders/orders.js");
const { createCart } = require("./cart/cart.js");

const dropTables = async () => {
  try {
    console.log("DROPPING TABLES");
    await client.query(`DROP TABLE IF EXISTS cart;`);
    await client.query(`DROP TABLE IF EXISTS orders;`);
    await client.query(`DROP TABLE IF EXISTS products;`);
    await client.query(`DROP TABLE IF EXISTS categories;`);
    await client.query(`DROP TABLE IF EXISTS users;`);
    console.log("TABLES DROPPED SUCCESSFULLY");
  } catch (error) {
    console.error("ERROR DROPPING TABLES: ", error);
  }
};

const createTables = async () => {
  try {
    console.log("CREATING TABLES");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        price FLOAT NOT NULL,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_amount FLOAT NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE cart (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        PRIMARY KEY (user_id, product_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("TABLES CREATED SUCCESSFULLY");
  } catch (error) {
    console.error("ERROR CREATING TABLES: ", error);
  }
};

const init = async () => {
  try {
    await client.connect();
    console.log("Successfully connected to database.");

    await dropTables();
    await createTables();
    await createUser("user01", "pass1234!", "user01@example.com");
    await createCategory("guitar");
    await createProduct(
      "acoustic guitar",
      "One of a kind acoustic guitar.",
      149.99,
      1,
      null
    );
    await createOrder(1, 50.13, "shipped");
    await createCart(1, 1, 4);
  } catch (error) {
    console.error("ERROR CONNECTING TO DATABASE: ", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
};

init();
