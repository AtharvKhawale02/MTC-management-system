const express = require("express");
const router = express.Router();

const accessoryController = require("../controllers/accessory.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// GET ALL ACCESSORIES
router.get(
  "/accessories",
  authenticate,
  authorize("admin"),
  accessoryController.getAllAccessories
);

// GET ACCESSORY BY ID
router.get(
  "/accessories/:id",
  authenticate,
  authorize("admin"),
  accessoryController.getAccessoryById
);

// CREATE ACCESSORY
router.post(
  "/accessories",
  authenticate,
  authorize("admin"),
  accessoryController.createAccessory
);

// UPDATE ACCESSORY
router.put(
  "/accessories/:id",
  authenticate,
  authorize("admin"),
  accessoryController.updateAccessory
);

// DELETE ACCESSORY
router.delete(
  "/accessories/:id",
  authenticate,
  authorize("admin"),
  accessoryController.deleteAccessory
);

// GET PARAMETERS FOR ACCESSORY
router.get(
  "/accessories/:id/parameters",
  authenticate,
  authorize("admin"),
  accessoryController.getAccessoryParameters
);

// GET AVAILABLE PARAMETERS (NOT LINKED)
router.get(
  "/accessories/:id/available-parameters",
  authenticate,
  authorize("admin"),
  accessoryController.getAvailableParameters
);

// LINK PARAMETER TO ACCESSORY
router.post(
  "/accessories/:id/parameters",
  authenticate,
  authorize("admin"),
  accessoryController.linkParameter
);

// UNLINK PARAMETER FROM ACCESSORY
router.delete(
  "/accessories/:id/parameters/:parameterId",
  authenticate,
  authorize("admin"),
  accessoryController.unlinkParameter
);

module.exports = router;
