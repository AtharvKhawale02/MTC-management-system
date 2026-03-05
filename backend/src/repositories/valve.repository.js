const pool = require("../config/db");

// GET ALL VALVE TYPES WITH PARAMETER COUNT
exports.getAllValveTypes = async () => {
  const [rows] = await pool.query(
    `SELECT vt.id, vt.name, vt.created_at, vt.updated_at,
            COUNT(vp.id) as parameter_count
     FROM valve_types vt
     LEFT JOIN valve_type_parameters vp ON vt.id = vp.valve_type_id
     GROUP BY vt.id, vt.name, vt.created_at, vt.updated_at
     ORDER BY vt.created_at DESC`
  );
  return rows;
};

//  GET VALVE TYPE BY ID
exports.getValveTypeById = async (id) => {
  const [rows] = await pool.query(
    `SELECT vt.id, vt.name, vt.created_at, vt.updated_at,
            COUNT(vp.id) as parameter_count
     FROM valve_types vt
     LEFT JOIN valve_type_parameters vp ON vt.id = vp.valve_type_id
     WHERE vt.id = ?
     GROUP BY vt.id, vt.name, vt.created_at, vt.updated_at`,
    [id]
  );
  return rows[0];
};

// FIND VALVE TYPE BY NAME
exports.findByName = async (name) => {
  const [rows] = await pool.query(
    "SELECT * FROM valve_types WHERE name = ?",
    [name]
  );
  return rows[0];
};

// FIND VALVE TYPE BY NAME (EXCLUDING SPECIFIC ID - FOR UPDATES)
exports.findByNameExcludingId = async (name, id) => {
  const [rows] = await pool.query(
    "SELECT * FROM valve_types WHERE name = ? AND id != ?",
    [name, id]
  );
  return rows[0];
};

//  CREATE VALVE TYPE
exports.createValveType = async (name) => {
  const [result] = await pool.query(
    "INSERT INTO valve_types (name) VALUES (?)",
    [name]
  );
  return result;
};

//  UPDATE VALVE TYPE
exports.updateValveType = async (id, name) => {
  await pool.query(
    "UPDATE valve_types SET name = ? WHERE id = ?",
    [name, id]
  );
};

//  DELETE VALVE TYPE
exports.deleteValveType = async (id) => {
  await pool.query(
    "DELETE FROM valve_types WHERE id = ?",
    [id]
  );
};

// CHECK IF VALVE TYPE HAS PARAMETERS
exports.hasParameters = async (id) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM valve_type_parameters WHERE valve_type_id = ?",
    [id]
  );
  return rows[0].count > 0;
};

// CHECK IF VALVE TYPE IS USED IN TCDS (FOR DELETE VALIDATION)
exports.isUsedInTCDS = async (id) => {
  // Note: This assumes TCDS table will have a valve_type_id column in the future
  // For now, we'll check if the column exists first
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count FROM tcds 
       WHERE valve_type_id = ?`,
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

// GET PARAMETERS FOR A VALVE TYPE
exports.getValveTypeParameters = async (valveTypeId) => {
  const [rows] = await pool.query(
    `SELECT vp.id, vp.name, vp.input_type as type, vp.created_at,
            COUNT(pv.id) as value_count
     FROM valve_type_parameters vp
     LEFT JOIN parameter_values pv ON vp.id = pv.valve_type_parameter_id
     WHERE vp.valve_type_id = ?
     GROUP BY vp.id, vp.name, vp.input_type, vp.created_at
     ORDER BY vp.name`,
    [valveTypeId]
  );
  return rows;
};

//  GET PARAMETER BY ID
exports.getParameterById = async (parameterId) => {
  const [rows] = await pool.query(
    `SELECT vp.id, vp.valve_type_id, vp.name, vp.input_type as type, 
            vp.created_at, vp.updated_at,
            COUNT(pv.id) as value_count
     FROM valve_type_parameters vp
     LEFT JOIN parameter_values pv ON vp.id = pv.valve_type_parameter_id
     WHERE vp.id = ?
     GROUP BY vp.id`,
    [parameterId]
  );
  return rows[0];
};

//  CREATE PARAMETER FOR VALVE TYPE
exports.createParameter = async (valveTypeId, name, type) => {
  const [result] = await pool.query(
    `INSERT INTO valve_type_parameters (valve_type_id, name, input_type) 
     VALUES (?, ?, ?)`,
    [valveTypeId, name, type]
  );
  return result;
};

//  UPDATE PARAMETER
exports.updateParameter = async (parameterId, name, type) => {
  await pool.query(
    `UPDATE valve_type_parameters 
     SET name = ?, input_type = ?
     WHERE id = ?`,
    [name, type, parameterId]
  );
};

//  DELETE PARAMETER
exports.deleteParameter = async (parameterId) => {
  await pool.query(
    "DELETE FROM valve_type_parameters WHERE id = ?",
    [parameterId]
  );
};

//  CHECK IF PARAMETER NAME EXISTS FOR VALVE TYPE
exports.parameterNameExists = async (valveTypeId, name, excludeId = null) => {
  let query = "SELECT COUNT(*) as count FROM valve_type_parameters WHERE valve_type_id = ? AND name = ?";
  let params = [valveTypeId, name];
  
  if (excludeId) {
    query += " AND id != ?";
    params.push(excludeId);
  }
  
  const [rows] = await pool.query(query, params);
  return rows[0].count > 0;
};

// ============================================================
// PARAMETER VALUES METHODS
// ============================================================

// GET ALL VALUES FOR A PARAMETER
exports.getParameterValues = async (parameterId) => {
  const [rows] = await pool.query(
    `SELECT id, valve_type_parameter_id, value, created_at, updated_at
     FROM parameter_values
     WHERE valve_type_parameter_id = ?
     ORDER BY value ASC`,
    [parameterId]
  );
  return rows;
};

// GET PARAMETER VALUE BY ID
exports.getParameterValueById = async (valueId) => {
  const [rows] = await pool.query(
    "SELECT * FROM parameter_values WHERE id = ?",
    [valueId]
  );
  return rows[0];
};

// CREATE PARAMETER VALUE
exports.createParameterValue = async (parameterId, value) => {
  const [result] = await pool.query(
    "INSERT INTO parameter_values (valve_type_parameter_id, value) VALUES (?, ?)",
    [parameterId, value]
  );
  return result;
};

// UPDATE PARAMETER VALUE
exports.updateParameterValue = async (valueId, value) => {
  await pool.query(
    "UPDATE parameter_values SET value = ? WHERE id = ?",
    [value, valueId]
  );
};

// DELETE PARAMETER VALUE
exports.deleteParameterValue = async (valueId) => {
  await pool.query(
    "DELETE FROM parameter_values WHERE id = ?",
    [valueId]
  );
};
// CHECK IF VALUE EXISTS FOR PARAMETER
exports.valueExists = async (parameterId, value, excludeId = null) => {
  let query = "SELECT COUNT(*) as count FROM parameter_values WHERE valve_type_parameter_id = ? AND LOWER(value) = LOWER(?)";
  let params = [parameterId, value];
  
  if (excludeId) {
    query += " AND id != ?";
    params.push(excludeId);
  }
  
  const [rows] = await pool.query(query, params);
  return rows[0].count > 0;
};

// ============================================================
// LEGACY LINK/UNLINK METHODS (NO LONGER USED)
// Parameters are created directly for valve types, not linked
// ============================================================

// GET AVAILABLE PARAMETERS (returns empty - parameters are created, not linked)
exports.getAvailableParameters = async (valveTypeId) => {
  // In the current database structure, parameters are created directly for valve types
  // There is no concept of "available parameters" to link
  return [];
};

// CHECK IF PARAMETER IS LINKED (checks if parameter belongs to valve type)
exports.isParameterLinked = async (valveTypeId, parameterId) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM valve_type_parameters WHERE id = ? AND valve_type_id = ?",
    [parameterId, valveTypeId]
  );
  return rows[0].count > 0;
};

// LINK PARAMETER (not applicable - use createParameter instead)
exports.linkParameter = async (valveTypeId, parameterId) => {
  // This function is not applicable in the current structure
  // Parameters are created directly for valve types, not linked from a global pool
  throw new Error("Link functionality is not supported. Create parameters directly for the valve type.");
};

// UNLINK PARAMETER (deletes the parameter)
exports.unlinkParameter = async (valveTypeId, parameterId) => {
  // In the current structure, "unlinking" means deleting the parameter
  await pool.query(
    "DELETE FROM valve_type_parameters WHERE id = ? AND valve_type_id = ?",
    [parameterId, valveTypeId]
  );
};

//  CREATE VALVE-SPECIFIC PARAMETER
exports.createValveParameter = async (valveTypeId, parameterData) => {
  const { name, type } = parameterData;
  
  const [result] = await pool.query(
    `INSERT INTO valve_type_parameters 
    (valve_type_id, name, input_type, created_at, updated_at) 
    VALUES (?, ?, ?, NOW(), NOW())`,
    [valveTypeId, name, type]
  );

  return {
    id: result.insertId,
    valve_type_id: valveTypeId,
    name,
    type
  };
};

//  UPDATE VALVE-SPECIFIC PARAMETER
exports.updateValveParameter = async (valveTypeId, parameterId, parameterData) => {
  const { name, type } = parameterData;
  
  await pool.query(
    `UPDATE valve_type_parameters 
    SET name = ?, input_type = ?, updated_at = NOW() 
    WHERE id = ? AND valve_type_id = ?`,
    [name, type, parameterId, valveTypeId]
  );
};
