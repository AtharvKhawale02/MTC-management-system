const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
<<<<<<< HEAD
  port: process.env.DB_PORT,
=======
  port: process.env.DB_PORT || 3306,  // Added: Cloud database uses custom port
>>>>>>> b316133 (Connect backend auth and update frontend integration)
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;