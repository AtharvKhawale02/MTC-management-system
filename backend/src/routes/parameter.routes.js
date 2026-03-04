const express = require("express");
const router = express.Router();

const parameterController = require("../controllers/parameter.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// ====================
// PARAMETERS ROUTES
// ====================

// GET ALL PARAMETERS
router.get(
  "/parameters",
  authenticate,
  authorize("admin"),
  parameterController.getAllParameters
);

// GET PARAMETER BY ID
router.get(
  "/parameters/:id",
  authenticate,
  authorize("admin"),
  parameterController.getParameterById
);

// CREATE PARAMETER
router.post(
  "/parameters",
  authenticate,
  authorize("admin"),
  parameterController.createParameter
);

// UPDATE PARAMETER
router.put(
  "/parameters/:id",
  authenticate,
  authorize("admin"),
  parameterController.updateParameter
);

// DELETE PARAMETER
router.delete(
  "/parameters/:id",
  authenticate,
  authorize("admin"),
  parameterController.deleteParameter
);

// ====================
// PARAMETER VALUES ROUTES
// ====================

// GET ALL VALUES FOR A PARAMETER
router.get(
  "/parameters/:parameterId/values",
  authenticate,
  authorize("admin"),
  parameterController.getParameterValues
);

// GET PARAMETER VALUE BY ID
router.get(
  "/parameter-values/:valueId",
  authenticate,
  authorize("admin"),
  parameterController.getParameterValueById
);

// CREATE PARAMETER VALUE
router.post(
  "/parameters/:parameterId/values",
  authenticate,
  authorize("admin"),
  parameterController.createParameterValue
);

// UPDATE PARAMETER VALUE
router.put(
  "/parameter-values/:valueId",
  authenticate,
  authorize("admin"),
  parameterController.updateParameterValue
);

// DELETE PARAMETER VALUE
router.delete(
  "/parameter-values/:valueId",
  authenticate,
  authorize("admin"),
  parameterController.deleteParameterValue
);

module.exports = router;
