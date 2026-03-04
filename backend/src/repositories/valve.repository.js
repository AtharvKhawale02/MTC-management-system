const pool = require("../config/db");

// GET ALL VALVE TYPES WITH PARAMETER COUNT
exports.getAllValveTypes = async () => {
  const [rows] = await pool.query(
    `SELECT vt.id, vt.name, vt.created_at, vt.updated_at,
            COUNT(vp.id) as parameter_count
     FROM valve_types vt
     LEFT JOIN valve_parameters vp ON vt.id = vp.valve_type_id
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
     LEFT JOIN valve_parameters vp ON vt.id = vp.valve_type_id
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
    "SELECT COUNT(*) as count FROM valve_parameters WHERE valve_type_id = ?",
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
