const userService = require("../services/user.service");

exports.registerUser = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;

    const { name, email, password, role, unit_id } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All required fields must be provided."
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        message: "Name must not exceed 100 characters."
      });
    }

    await userService.createUser(
      adminUser,
      { name, email, password, role, unit_id },
      ipAddress
    );

    res.status(201).json({
      message: "User created successfully."
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;

    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({
        message: "User ID and new password are required."
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters."
      });
    }

    await userService.resetPassword(
      adminUser,
      userId,
      newPassword,
      ipAddress
    );

    res.json({
      message: "Password reset successfully."
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// ✅ GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await userService.getAllUsers(page, limit);

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ✅ GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userService.getUserById(userId);

    res.json(user);

  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
};

// ✅ UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const userId = req.params.id;

    const { name, email, password, role, unit_id, is_active } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        message: "Name, email, and role are required."
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        message: "Name must not exceed 100 characters."
      });
    }

    await userService.updateUser(
      adminUser,
      userId,
      { name, email, password, role, unit_id, is_active },
      ipAddress
    );

    res.json({
      message: "User updated successfully."
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const userId = req.params.id;

    const result = await userService.deleteUser(adminUser, userId, ipAddress);

    res.json(result);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// ✅ GET ALL UNITS
exports.getUnits = async (req, res) => {
  try {
    const units = await userService.getUnits();

    res.json(units);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};