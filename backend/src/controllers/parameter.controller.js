const parameterService = require("../services/parameter.service");

// ====================
// PARAMETERS CONTROLLERS
// ====================

// GET ALL PARAMETERS
exports.getAllParameters = async (req, res) => {
  try {
    const parameters = await parameterService.getAllParameters();
    
    res.json({
      success: true,
      data: parameters
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET PARAMETER BY ID
exports.getParameterById = async (req, res) => {
  try {
    const id = req.params.id;
    const parameter = await parameterService.getParameterById(id);

    res.json({
      success: true,
      data: parameter
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE PARAMETER
exports.createParameter = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const data = req.body;

    const result = await parameterService.createParameter(adminUser, data, ipAddress);
    
    // Fetch the newly created parameter
    const newParameter = await parameterService.getParameterById(result.insertId);

    res.status(201).json({
      success: true,
      message: "Parameter created successfully.",
      data: newParameter
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE PARAMETER
exports.updateParameter = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const id = req.params.id;
    const data = req.body;

    await parameterService.updateParameter(adminUser, id, data, ipAddress);

    res.json({
      success: true,
      message: "Parameter updated successfully."
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE PARAMETER
exports.deleteParameter = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const id = req.params.id;

    const result = await parameterService.deleteParameter(adminUser, id, ipAddress);

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ====================
// PARAMETER VALUES CONTROLLERS
// ====================

// GET ALL VALUES FOR A PARAMETER
exports.getParameterValues = async (req, res) => {
  try {
    const parameterId = req.params.parameterId;
    const values = await parameterService.getParameterValues(parameterId);

    res.json({
      success: true,
      data: values
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET PARAMETER VALUE BY ID
exports.getParameterValueById = async (req, res) => {
  try {
    const valueId = req.params.valueId;
    const value = await parameterService.getParameterValueById(valueId);

    res.json({
      success: true,
      data: value
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE PARAMETER VALUE
exports.createParameterValue = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const parameterId = req.params.parameterId;
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({
        success: false,
        message: "Value is required."
      });
    }

    await parameterService.createParameterValue(adminUser, parameterId, value, ipAddress);

    res.status(201).json({
      success: true,
      message: "Parameter value created successfully."
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE PARAMETER VALUE
exports.updateParameterValue = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const valueId = req.params.valueId;
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({
        success: false,
        message: "Value is required."
      });
    }

    await parameterService.updateParameterValue(adminUser, valueId, value, ipAddress);

    res.json({
      success: true,
      message: "Parameter value updated successfully."
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE PARAMETER VALUE
exports.deleteParameterValue = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const valueId = req.params.valueId;

    const result = await parameterService.deleteParameterValue(adminUser, valueId, ipAddress);

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
