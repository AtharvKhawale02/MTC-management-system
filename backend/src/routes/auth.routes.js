const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Public route - anyone can access
router.post("/login", authController.login);
router.get("/check-auth", authenticate, authController.checkAuth);
router.post("/logout", authenticate, authController.logout);

// Protected route - needs valid token
router.get("/check-auth", authenticate, authController.checkAuth);

module.exports = router;