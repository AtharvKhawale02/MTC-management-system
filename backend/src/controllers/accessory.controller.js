const accessoryService = require("../services/accessory.service");

// GET ALL ACCESSORIES
exports.getAllAccessories = async (req, res) => {
  try {
    const accessories = await accessoryService.getAllAccessories();
    
    res.json({
      success: true,
      data: accessories
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ACCESSORY BY ID
exports.getAccessoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const accessory = await accessoryService.getAccessoryById(id);

    res.json({
      success: true,
      data: accessory
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE ACCESSORY
exports.createAccessory = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Accessory name is required."
      });
    }

    await accessoryService.createAccessory(adminUser, name, ipAddress);

    res.status(201).json({
      success: true,
      message: "Accessory created successfully."
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE ACCESSORY
exports.updateAccessory = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Accessory name is required."
      });
    }

    await accessoryService.updateAccessory(adminUser, id, name, ipAddress);

    res.json({
      success: true,
      message: "Accessory updated successfully."
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE ACCESSORY
exports.deleteAccessory = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const id = req.params.id;

    const result = await accessoryService.deleteAccessory(adminUser, id, ipAddress);

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

// GET PARAMETERS FOR ACCESSORY
exports.getAccessoryParameters = async (req, res) => {
  try {
    const accessoryId = req.params.id;
    const parameters = await accessoryService.getAccessoryParameters(accessoryId);

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

// GET AVAILABLE PARAMETERS
exports.getAvailableParameters = async (req, res) => {
  try {
    const accessoryId = req.params.id;
    const parameters = await accessoryService.getAvailableParameters(accessoryId);

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

// LINK PARAMETER TO ACCESSORY
exports.linkParameter = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const accessoryId = req.params.id;
    const { parameter_id } = req.body;

    if (!parameter_id) {
      return res.status(400).json({
        success: false,
        message: "Parameter ID is required."
      });
    }

    const result = await accessoryService.linkParameter(
      adminUser,
      accessoryId,
      parameter_id,
      ipAddress
    );

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

// UNLINK PARAMETER FROM ACCESSORY
exports.unlinkParameter = async (req, res) => {
  try {
    const adminUser = req.user;
    const ipAddress = req.ip;
    const accessoryId = req.params.id;
    const parameterId = req.params.parameterId;

    const result = await accessoryService.unlinkParameter(
      adminUser,
      accessoryId,
      parameterId,
      ipAddress
    );

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

module.exports = exports;
