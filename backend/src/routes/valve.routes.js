const express = require("express");
const router = express.Router();

const valveController = require("../controllers/valve.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

//  GET ALL VALVE TYPES
router.get(
  "/valve-types",
  authenticate,
  authorize("admin"),
  valveController.getAllValveTypes
);

//  GET VALVE TYPE BY ID
router.get(
  "/valve-types/:id",
  authenticate,
  authorize("admin"),
  valveController.getValveTypeById
);

//  CREATE VALVE TYPE
router.post(
  "/valve-types",
  authenticate,
  authorize("admin"),
  valveController.createValveType
);

//  UPDATE VALVE TYPE
router.put(
  "/valve-types/:id",
  authenticate,
  authorize("admin"),
  valveController.updateValveType
);

// DELETE VALVE TYPE
router.delete(
  "/valve-types/:id",
  authenticate,
  authorize("admin"),
  valveController.deleteValveType
);

// ✅ GET PARAMETERS FOR VALVE TYPE
router.get(
  "/valve-types/:id/parameters",
  authenticate,
  authorize("admin"),
  valveController.getValveTypeParameters
);

// ✅ GET AVAILABLE PARAMETERS (NOT LINKED)
router.get(
  "/valve-types/:id/available-parameters",
  authenticate,
  authorize("admin"),
  valveController.getAvailableParameters
);

// ✅ LINK PARAMETER TO VALVE TYPE
router.post(
  "/valve-types/:id/parameters",
  authenticate,
  authorize("admin"),
  valveController.linkParameter
);

// ✅ UNLINK PARAMETER FROM VALVE TYPE
router.delete(
  "/valve-types/:id/parameters/:parameterId",
  authenticate,
  authorize("admin"),
  valveController.unlinkParameter
);

module.exports = router;
