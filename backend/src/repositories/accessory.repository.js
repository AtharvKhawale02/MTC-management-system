const pool = require("../config/db");

// GET ALL ACCESSORIES WITH PARAMETER COUNT
exports.getAllAccessories = async () => {
  const [rows] = await pool.query(
    `SELECT a.id, a.name, a.created_at, a.updated_at,
            COUNT(ap.id) as parameter_count
     FROM accessories a
     LEFT JOIN accessory_parameters ap ON a.id = ap.accessory_id
     GROUP BY a.id, a.name, a.created_at, a.updated_at
     ORDER BY a.created_at DESC`
  );
  return rows;
};

// GET ACCESSORY BY ID
exports.getAccessoryById = async (id) => {
  const [rows] = await pool.query(
    `SELECT a.id, a.name, a.created_at, a.updated_at,
            COUNT(ap.id) as parameter_count
     FROM accessories a
     LEFT JOIN accessory_parameters ap ON a.id = ap.accessory_id
     WHERE a.id = ?
     GROUP BY a.id, a.name, a.created_at, a.updated_at`,
    [id]
  );
  return rows[0];
};

// FIND ACCESSORY BY NAME
exports.findByName = async (name) => {
  const [rows] = await pool.query(
    "SELECT * FROM accessories WHERE name = ?",
    [name]
  );
  return rows[0];
};

// FIND ACCESSORY BY NAME (EXCLUDING SPECIFIC ID - FOR UPDATES)
exports.findByNameExcludingId = async (name, id) => {
  const [rows] = await pool.query(
    "SELECT * FROM accessories WHERE name = ? AND id != ?",
    [name, id]
  );
  return rows[0];
};

// CREATE ACCESSORY
exports.createAccessory = async (name) => {
  const [result] = await pool.query(
    "INSERT INTO accessories (name) VALUES (?)",
    [name]
  );
  return result;
};

// UPDATE ACCESSORY
exports.updateAccessory = async (id, name) => {
  await pool.query(
    "UPDATE accessories SET name = ? WHERE id = ?",
    [name, id]
  );
};

// DELETE ACCESSORY
exports.deleteAccessory = async (id) => {
  await pool.query(
    "DELETE FROM accessories WHERE id = ?",
    [id]
  );
};

// CHECK IF ACCESSORY HAS PARAMETERS
exports.hasParameters = async (id) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM accessory_parameters WHERE accessory_id = ?",
    [id]
  );
  return rows[0].count > 0;
};

// CHECK IF ACCESSORY IS USED IN TCDS (FOR DELETE VALIDATION)
exports.isUsedInTCDS = async (id) => {
  // Note: This assumes TCDS table will have an accessory_id column in the future
  // For now, we'll check if the column exists first
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count FROM tcds 
       WHERE accessory_id = ?`,
      [id]
    );
    return rows[0].count > 0;
  } catch (error) {
    // If column doesn't exist yet, return false (allow deletion)
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return false;
    }
    throw error;
  }
};

// GET PARAMETERS LINKED TO AN ACCESSORY
exports.getAccessoryParameters = async (accessoryId) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.type, p.is_mandatory, ap.created_at as linked_at
     FROM parameters p
     JOIN accessory_parameters ap ON p.id = ap.parameter_id
     WHERE ap.accessory_id = ?
     ORDER BY p.name`,
    [accessoryId]
  );
  return rows;
};

// GET AVAILABLE PARAMETERS (NOT LINKED TO ACCESSORY)
exports.getAvailableParameters = async (accessoryId) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.type, p.is_mandatory
     FROM parameters p
     WHERE p.id NOT IN (
       SELECT parameter_id FROM accessory_parameters WHERE accessory_id = ?
     )
     ORDER BY p.name`,
    [accessoryId]
  );
  return rows;
};

// LINK PARAMETER TO ACCESSORY
exports.linkParameter = async (accessoryId, parameterId) => {
  const [result] = await pool.query(
    `INSERT INTO accessory_parameters (accessory_id, parameter_id) 
     VALUES (?, ?)`,
    [accessoryId, parameterId]
  );
  return result;
};

// UNLINK PARAMETER FROM ACCESSORY
exports.unlinkParameter = async (accessoryId, parameterId) => {
  await pool.query(
    `DELETE FROM accessory_parameters 
     WHERE accessory_id = ? AND parameter_id = ?`,
    [accessoryId, parameterId]
  );
};

// CHECK IF PARAMETER IS LINKED
exports.isParameterLinked = async (accessoryId, parameterId) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) as count FROM accessory_parameters 
     WHERE accessory_id = ? AND parameter_id = ?`,
    [accessoryId, parameterId]
  );
  return rows[0].count > 0;
};

module.exports = exports;
