const pool = require("../config/db");

exports.logAction = async (userId, action, entityType, entityId, ip) => {
  try {
    await pool.query(
      "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address) VALUES (?, ?, ?, ?, ?)",
      [userId, action, entityType, entityId, ip]
    );
  } catch (error) {
    // If audit_logs table doesn't exist, just log to console and continue
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.warn(`Audit log skipped (table doesn't exist): ${action} by user ${userId}`);
      return;
    }
    throw error;
  }
};