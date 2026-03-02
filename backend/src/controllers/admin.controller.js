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

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters."
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