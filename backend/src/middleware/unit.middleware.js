exports.enforceUnitAccess = (req, res, next) => {
  try {
    const user = req.user;

    // Admin can bypass unit restriction
    if (user.role === "admin") {
      return next();
    }

    // If body contains unit_id, enforce it matches user's unit
    if (req.body.unit_id && req.body.unit_id !== user.unit_id) {
      return res.status(403).json({
        message: "Access denied: Invalid unit."
      });
    }

    // Attach enforced unit to request for safety
    req.body.unit_id = user.unit_id;

    next();

  } catch (error) {
    return res.status(500).json({
      message: "Unit validation failed."
    });
  }
};