const { Pool } = require("pg");

const pool = new Pool({
  user: "admin",
  host: "my-postgres",
  database: "sleep_db",
  password: "password",
  port: 5432,
});

module.exports = pool;

// TODO: mettere ENV di DEV e PROD