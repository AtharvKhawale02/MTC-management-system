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

// ✅ GET ALL USERS WITH PAGINATION
exports.getAllUsers = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.unit_id, u.is_active, u.created_at,
            un.name as unit_name
     FROM users u
     LEFT JOIN units un ON u.unit_id = un.id
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  
  const [[{ total }]] = await pool.query(
    "SELECT COUNT(*) as total FROM users"
  );
  
  return {
    users: rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

// ✅ GET USER BY ID
exports.getUserById = async (userId) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.unit_id, u.is_active, u.created_at,
            un.name as unit_name
     FROM users u
     LEFT JOIN units un ON u.unit_id = un.id
     WHERE u.id = ?`,
    [userId]
  );
  return rows[0];
};

// ✅ UPDATE USER
exports.updateUser = async (userId, userData) => {
  const { name, email, password_hash, role, unit_id, is_active } = userData;
  
  let query = `UPDATE users SET name = ?, email = ?, role = ?, unit_id = ?`;
  let params = [name, email, role, unit_id];
  
  if (password_hash) {
    query += `, password_hash = ?, current_session_token = NULL`;
    params.push(password_hash);
  }
  
  if (is_active !== undefined) {
    query += `, is_active = ?`;
    params.push(is_active);
  }
  
  query += ` WHERE id = ?`;
  params.push(userId);
  
  const [result] = await pool.query(query, params);
  return result;
};

// ✅ CHECK IF USER HAS CREATED RECORDS
exports.checkUserHasRecords = async (userId) => {
  try {
    // Check if user has created any TCDS records
    const [[tcdsResult]] = await pool.query(
      "SELECT COUNT(*) as count FROM tcds WHERE created_by = ?",
      [userId]
    );
    
    // Check if user has created any MTC records
    const [[mtcResult]] = await pool.query(
      "SELECT COUNT(*) as count FROM mtc WHERE created_by = ?",
      [userId]
    );
    
    return (tcdsResult.count > 0 || mtcResult.count > 0);
  } catch (error) {
    // If tables don't exist yet, return false (safe to delete)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return false;
    }
    throw error;
  }
};

// ✅ DEACTIVATE USER
exports.deactivateUser = async (userId) => {
  await pool.query(
    `UPDATE users 
     SET is_active = FALSE, current_session_token = NULL
     WHERE id = ?`,
    [userId]
  );
};

// ✅ DELETE USER (HARD DELETE)
exports.deleteUser = async (userId) => {
  await pool.query(
    "DELETE FROM users WHERE id = ?",
    [userId]
  );
};

// ✅ CHECK EMAIL EXISTS (EXCLUDING CURRENT USER)
exports.findByEmailExcludingUser = async (email, excludeUserId) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ? AND id != ?",
    [email, excludeUserId]
  );
  return rows[0];
};

// ✅ CHECK EMAIL EXISTS (FOR NEW USER)
exports.findByEmailForCreate = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

// ✅ GET ALL UNITS
exports.getUnits = async () => {
  const [rows] = await pool.query(
    "SELECT id, name FROM units ORDER BY name"
  );
  return rows;
};