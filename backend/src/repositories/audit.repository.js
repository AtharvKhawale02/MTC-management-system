const pool = require("../config/db");

exports.logAction = async (userId, action, entityType, entityId, ip) => {
  await pool.query(
    "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address) VALUES (?, ?, ?, ?, ?)",
    [userId, action, entityType, entityId, ip]
  );
};