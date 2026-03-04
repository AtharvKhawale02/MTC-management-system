const { verifyToken } = require("../utils/token");
const pool = require("../config/db");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = verifyToken(token);

    // Verify user still exists and is active
    const [rows] = await pool.query(
      "SELECT id, name, email, role, unit_id, is_active FROM users WHERE id = ? AND is_active = TRUE",
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "User not found or inactive" });
    }

    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};