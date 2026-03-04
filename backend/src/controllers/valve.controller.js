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
