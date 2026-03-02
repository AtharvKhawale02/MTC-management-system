const pool = require("../config/db");

// ✅ FIND USER BY EMAIL
exports.findByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ? AND is_active = TRUE",
    [email]
  );
  return rows[0];
};

// ✅ UPDATE SESSION TOKEN
exports.updateSessionToken = async (userId, token) => {
  await pool.query(
    "UPDATE users SET current_session_token = ? WHERE id = ?",
    [token, userId]
  );
};

// ✅ CREATE USER
exports.createUser = async (userData) => {
  const { name, email, password_hash, role, unit_id } = userData;

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role, unit_id)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, password_hash, role, unit_id]
  );

  return result;
};

// ✅ UPDATE PASSWORD
exports.updatePassword = async (userId, password_hash) => {
  await pool.query(
    `UPDATE users 
     SET password_hash = ?, current_session_token = NULL
     WHERE id = ?`,
    [password_hash, userId]
  );
};