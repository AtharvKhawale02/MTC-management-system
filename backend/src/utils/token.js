const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      unit_id: user.unit_id
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};