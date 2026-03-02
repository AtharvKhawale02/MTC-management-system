const authService = require("../services/auth.service");

// LOGIN: Check email & password, return token + user info
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const result = await authService.login(email, password);

    // FIXED: Return user info (name, email, role) so frontend knows who logged in
    res.json({
      message: "Login successful",
      token: result.token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role
      }
    });

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// CHECK AUTH: Verify if user's token is valid
exports.checkAuth = async (req, res) => {
  // req.user comes from auth.middleware.js (it decoded the token)
  res.json({
    role: req.user.role,
    name: req.user.name,
    email: req.user.email
  });
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