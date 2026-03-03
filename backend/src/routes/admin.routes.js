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

// ✅ GET ALL USERS
router.get(
  "/users",
  authenticate,
  authorize("admin"),
  adminController.getAllUsers
);

// ✅ GET USER BY ID
router.get(
  "/users/:id",
  authenticate,
  authorize("admin"),
  adminController.getUserById
);

// ✅ UPDATE USER
router.put(
  "/users/:id",
  authenticate,
  authorize("admin"),
  adminController.updateUser
);

// ✅ DELETE USER
router.delete(
  "/users/:id",
  authenticate,
  authorize("admin"),
  adminController.deleteUser
);

// ✅ GET ALL UNITS
router.get(
  "/units",
  authenticate,
  authorize("admin"),
  adminController.getUnits
);

module.exports = router;