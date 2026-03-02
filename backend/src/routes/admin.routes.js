const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.post(
  "/register",
  authenticate,
  authorize("admin"),
  adminController.registerUser
);

router.post(
  "/reset-password",
  authenticate,
  authorize("admin"),
  adminController.resetUserPassword
);

module.exports = router;