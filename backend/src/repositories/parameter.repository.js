const pool = require("../config/db");

// ====================
// PARAMETERS METHODS
// ====================

// GET ALL PARAMETERS
exports.getAllParameters = async () => {
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.type, p.is_mandatory, p.validation_rule, 
            p.created_at, p.updated_at,
            COUNT(pv.id) as value_count
     FROM parameters p
     LEFT JOIN parameter_values pv ON p.id = pv.parameter_id
     GROUP BY p.id, p.name, p.type, p.is_mandatory, p.validation_rule, p.created_at, p.updated_at
     ORDER BY p.created_at DESC`
  );
  return rows;
};

// GET PARAMETER BY ID
exports.getParameterById = async (id) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.type, p.is_mandatory, p.validation_rule,
            p.created_at, p.updated_at,
            COUNT(pv.id) as value_count
     FROM parameters p
     LEFT JOIN parameter_values pv ON p.id = pv.parameter_id
     WHERE p.id = ?
     GROUP BY p.id, p.name, p.type, p.is_mandatory, p.validation_rule, p.created_at, p.updated_at`,
    [id]
  );
  return rows[0];
};

// FIND PARAMETER BY NAME
exports.findParameterByName = async (name) => {
  const [rows] = await pool.query(
    "SELECT * FROM parameters WHERE name = ?",
    [name]
  );
  return rows[0];
};

// FIND PARAMETER BY NAME (EXCLUDING SPECIFIC ID)
exports.findParameterByNameExcludingId = async (name, id) => {
  const [rows] = await pool.query(
    "SELECT * FROM parameters WHERE name = ? AND id != ?",
    [name, id]
  );
  return rows[0];
};

// CREATE PARAMETER
exports.createParameter = async (name, type, is_mandatory, validation_rule) => {
  const [result] = await pool.query(
    "INSERT INTO parameters (name, type, is_mandatory, validation_rule) VALUES (?, ?, ?, ?)",
    [name, type, is_mandatory, validation_rule]
  );
  return result;
};

// UPDATE PARAMETER
exports.updateParameter = async (id, name, type, is_mandatory, validation_rule) => {
  await pool.query(
    "UPDATE parameters SET name = ?, type = ?, is_mandatory = ?, validation_rule = ? WHERE id = ?",
    [name, type, is_mandatory, validation_rule, id]
  );
};

// DELETE PARAMETER
exports.deleteParameter = async (id) => {
  await pool.query("DELETE FROM parameters WHERE id = ?", [id]);
};

// CHECK IF PARAMETER IS USED IN VALVE TYPES
exports.isParameterUsedInValveTypes = async (id) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM valve_parameters WHERE parameter_id = ?",
    [id]
  );
  return rows[0].count > 0;
};

// CHECK IF PARAMETER IS USED IN TCDS RECORDS
exports.isParameterUsedInTCDS = async (id) => {
  // Note: This assumes TCDS table will have parameter values in the future
  // For now, return false (allow deletion)
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count FROM tcds_parameters 
       WHERE parameter_id = ?`,
      [id]
    );
    return rows[0].count > 0;
  } catch (error) {
    // If table doesn't exist yet, return false (allow deletion)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return false;
    }
    throw error;
  }
};

// ====================
// PARAMETER VALUES METHODS
// ====================

// GET ALL VALUES FOR A PARAMETER
exports.getParameterValues = async (parameterId) => {
  const [rows] = await pool.query(
    `SELECT id, parameter_id, value, created_at, updated_at
     FROM parameter_values
     WHERE parameter_id = ?
     ORDER BY value ASC`,
    [parameterId]
  );
  return rows;
};

// GET PARAMETER VALUE BY ID
exports.getParameterValueById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM parameter_values WHERE id = ?",
    [id]
  );
  return rows[0];
};

// FIND PARAMETER VALUE BY VALUE TEXT (CASE-INSENSITIVE)
exports.findParameterValueByValue = async (parameterId, value) => {
  const [rows] = await pool.query(
    "SELECT * FROM parameter_values WHERE parameter_id = ? AND LOWER(value) = LOWER(?)",
    [parameterId, value]
  );
  return rows[0];
};

// FIND PARAMETER VALUE BY VALUE TEXT (EXCLUDING SPECIFIC ID)
exports.findParameterValueByValueExcludingId = async (parameterId, value, id) => {
  const [rows] = await pool.query(
    "SELECT * FROM parameter_values WHERE parameter_id = ? AND LOWER(value) = LOWER(?) AND id != ?",
    [parameterId, value, id]
  );
  return rows[0];
};

// CREATE PARAMETER VALUE
exports.createParameterValue = async (parameterId, value) => {
  const [result] = await pool.query(
    "INSERT INTO parameter_values (parameter_id, value) VALUES (?, ?)",
    [parameterId, value]
  );
  return result;
};

// UPDATE PARAMETER VALUE
exports.updateParameterValue = async (id, value) => {
  await pool.query(
    "UPDATE parameter_values SET value = ? WHERE id = ?",
    [value, id]
  );
};

// DELETE PARAMETER VALUE
exports.deleteParameterValue = async (id) => {
  await pool.query("DELETE FROM parameter_values WHERE id = ?", [id]);
};

// CHECK IF PARAMETER VALUE IS USED IN TCDS RECORDS
exports.isParameterValueUsedInTCDS = async (id) => {
  // Note: This assumes TCDS table will have parameter values in the future
  // For now, return false (allow deletion)
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count FROM tcds_parameter_values 
       WHERE parameter_value_id = ?`,
      [id]
    );
    return rows[0].count > 0;
  } catch (error) {
    // If table doesn't exist yet, return false (allow deletion)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return false;
    }
    throw error;
  }
};
