const authService = require("../services/auth.service");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const result = await authService.login(email, password);

    res.json({
      message: "Login successful",
      token: result.token,
      role: result.user.role
    });

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.checkAuth = (req, res) => {
  res.json({ role: req.user.role, id: req.user.id });
};

exports.logout = async (req, res) => {
  try {
    const userRepo = require("../repositories/user.repository");
    await userRepo.updateSessionToken(req.user.id, null);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};