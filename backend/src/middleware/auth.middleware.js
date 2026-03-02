const { verifyToken } = require("../utils/token");
const pool = require("../config/db");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = verifyToken(token);

    const [rows] = await pool.query(
      "SELECT current_session_token FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!rows.length || rows[0].current_session_token !== token) {
      return res.status(401).json({ message: "Session expired." });
    }

    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};