const valveService = require("../services/valve.service");

//  GET ALL VALVE TYPES
exports.getAllValveTypes = async (req, res) => {
  try {
    const valveTypes = await valveService.getAllValveTypes();
    
    res.json({
      success: true,
      data: valveTypes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//  GET VALVE TYPE BY ID
exports.getValveTypeById = async (req, res) => {
  try {
    const id = req.params.id;
    const valveType = await valveService.getValveTypeById(id);

    res.json({
      success: true,
      data: valveType
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

//  CREATE VALVE TYPE
exports.createValveType = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Valve type name is required."
      });
    }

    await valveService.createValveType(adminUser, name, ipAddress);

    res.status(201).json({
      success: true,
      message: "Valve type created successfully."
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

//  UPDATE VALVE TYPE
exports.updateValveType = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Valve type name is required."
      });
    }

    await valveService.updateValveType(adminUser, id, name, ipAddress);

    res.json({
      success: true,
      message: "Valve type updated successfully."
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

//  DELETE VALVE TYPE
exports.deleteValveType = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const id = req.params.id;

    const result = await valveService.deleteValveType(adminUser, id, ipAddress);

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

//  GET PARAMETERS FOR VALVE TYPE
exports.getValveTypeParameters = async (req, res) => {
  try {
    const valveTypeId = req.params.id;
    const parameters = await valveService.getValveTypeParameters(valveTypeId);

    res.json({
      success: true,
      data: parameters
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

//  GET AVAILABLE PARAMETERS
exports.getAvailableParameters = async (req, res) => {
  try {
    const valveTypeId = req.params.id;
    const parameters = await valveService.getAvailableParameters(valveTypeId);

    res.json({
      success: true,
      data: parameters
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// LINK PARAMETER TO VALVE TYPE
exports.linkParameter = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const valveTypeId = req.params.id;
    const { parameterId, name, type } = req.body;

    // If parameterId is provided, it's a link operation
    if (parameterId) {
      const result = await valveService.linkParameter(adminUser, valveTypeId, parameterId, ipAddress);
      return res.json({
        success: true,
        message: result.message
      });
    }

    // Otherwise, it's a create operation for valve-specific parameter
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Parameter name and type are required."
      });
    }

    const result = await valveService.createValveParameter(
      adminUser,
      valveTypeId,
      { name, type },
      ipAddress
    );

    res.status(201).json({
      success: true,
      message: "Parameter created successfully.",
      data: result
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

//  UPDATE VALVE-SPECIFIC PARAMETER
exports.updateValveParameter = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const valveTypeId = req.params.id;
    const parameterId = req.params.parameterId;
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Parameter name and type are required."
      });
    }

    await valveService.updateValveParameter(
      adminUser,
      valveTypeId,
      parameterId,
      { name, type },
      ipAddress
    );

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

//  UNLINK PARAMETER FROM VALVE TYPE
exports.unlinkParameter = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const valveTypeId = req.params.id;
    const parameterId = req.params.parameterId;

    const result = await valveService.unlinkParameter(adminUser, valveTypeId, parameterId, ipAddress);

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

// ============================================================
// PARAMETER VALUES CONTROLLERS
// ============================================================

//  GET PARAMETER VALUES
exports.getParameterValues = async (req, res) => {
  try {
    const parameterId = req.params.parameterId;
    const values = await valveService.getParameterValues(parameterId);

    res.json({
      success: true,
      data: values
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

//  CREATE PARAMETER VALUE
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

    await valveService.createParameterValue(adminUser, parameterId, value, ipAddress);

    res.status(201).json({
      success: true,
      message: "Value created successfully."
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

//  DELETE PARAMETER VALUE
exports.deleteParameterValue = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const valueId = req.params.valueId;

    await valveService.deleteParameterValue(adminUser, valueId, ipAddress);

    res.json({
      success: true,
      message: "Value deleted successfully."
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
