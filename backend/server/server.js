const express = require("express");
const app = express();
const client = require("../db/client.js");
client.connect();
const { getProducts } = require("../db/products/products.js");

app.get("/", (req, res, next) => {
  res.send("Hello World!");
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error("ERROR FETCHING PRODUCTS: ", error);
    res.status(500).json({ error: result.error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
