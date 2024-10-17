const { Client } = require("pg");
const client = new Client("postgres://localhost:5432/echo_essentials");

module.exports = client;
