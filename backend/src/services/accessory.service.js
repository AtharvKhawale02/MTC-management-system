const accessoryRepo = require("../repositories/accessory.repository");
const auditRepo = require("../repositories/audit.repository");

// GET ALL ACCESSORIES
exports.getAllAccessories = async () => {
  return await accessoryRepo.getAllAccessories();
};

// GET ACCESSORY BY ID
exports.getAccessoryById = async (id) => {
  const accessory = await accessoryRepo.getAccessoryById(id);
  if (!accessory) {
    throw new Error("Accessory not found.");
  }
  return accessory;
};

// CREATE ACCESSORY
exports.createAccessory = async (adminUser, name, ipAddress) => {
  // Validate name
  if (!name || name.trim() === "") {
    throw new Error("Accessory name is required.");
  }

  const trimmedName = name.trim();

  if (trimmedName.length > 100) {
    throw new Error("Accessory name must not exceed 100 characters.");
  }

  // Check for duplicate name
  const existingAccessory = await accessoryRepo.findByName(trimmedName);
  if (existingAccessory) {
    throw new Error("Accessory name already exists.");
  }

  // Create accessory
  const result = await accessoryRepo.createAccessory(trimmedName);

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "CREATE_ACCESSORY",
    "ACCESSORY",
    result.insertId,
    ipAddress
  );

  return result;
};

// UPDATE ACCESSORY
exports.updateAccessory = async (adminUser, id, name, ipAddress) => {
  // Check if accessory exists
  const existingAccessory = await accessoryRepo.getAccessoryById(id);
  if (!existingAccessory) {
    throw new Error("Accessory not found.");
  }

  // Validate name
  if (!name || name.trim() === "") {
    throw new Error("Accessory name is required.");
  }

  const trimmedName = name.trim();

  if (trimmedName.length > 100) {
    throw new Error("Accessory name must not exceed 100 characters.");
  }

  // Check for duplicate name (excluding current accessory)
  const duplicateAccessory = await accessoryRepo.findByNameExcludingId(trimmedName, id);
  if (duplicateAccessory) {
    throw new Error("Accessory name already exists.");
  }

  // Update accessory
  await accessoryRepo.updateAccessory(id, trimmedName);

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "UPDATE_ACCESSORY",
    "ACCESSORY",
    id,
    ipAddress
  );

  return true;
};

// DELETE ACCESSORY
exports.deleteAccessory = async (adminUser, id, ipAddress) => {
  // Check if accessory exists
  const existingAccessory = await accessoryRepo.getAccessoryById(id);
  if (!existingAccessory) {
    throw new Error("Accessory not found.");
  }

  // Check if accessory is used in TCDS records
  const isUsedInTCDS = await accessoryRepo.isUsedInTCDS(id);
  if (isUsedInTCDS) {
    throw new Error("Cannot delete accessory because it is used in existing TCDS records.");
  }

  // Check if accessory has parameters
  const hasParameters = await accessoryRepo.hasParameters(id);
  if (hasParameters) {
    throw new Error("Cannot delete accessory because it has associated parameters.");
  }

  // Delete accessory
  await accessoryRepo.deleteAccessory(id);

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "DELETE_ACCESSORY",
    "ACCESSORY",
    id,
    ipAddress
  );

  return { message: "Accessory deleted successfully." };
};

// GET PARAMETERS FOR ACCESSORY
exports.getAccessoryParameters = async (accessoryId) => {
  // Check if accessory exists
  const accessory = await accessoryRepo.getAccessoryById(accessoryId);
  if (!accessory) {
    throw new Error("Accessory not found.");
  }
  
  return await accessoryRepo.getAccessoryParameters(accessoryId);
};

// GET AVAILABLE PARAMETERS (NOT LINKED)
exports.getAvailableParameters = async (accessoryId) => {
  // Check if accessory exists
  const accessory = await accessoryRepo.getAccessoryById(accessoryId);
  if (!accessory) {
    throw new Error("Accessory not found.");
  }
  
  return await accessoryRepo.getAvailableParameters(accessoryId);
};

// LINK PARAMETER TO ACCESSORY
exports.linkParameter = async (adminUser, accessoryId, parameterId, ipAddress) => {
  // Check if accessory exists
  const accessory = await accessoryRepo.getAccessoryById(accessoryId);
  if (!accessory) {
    throw new Error("Accessory not found.");
  }

  // Check if parameter is already linked
  const isLinked = await accessoryRepo.isParameterLinked(accessoryId, parameterId);
  if (isLinked) {
    throw new Error("Parameter is already linked to this accessory.");
  }

  // Link parameter
  await accessoryRepo.linkParameter(accessoryId, parameterId);

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "LINK_PARAMETER_TO_ACCESSORY",
    "ACCESSORY",
    accessoryId,
    ipAddress
  );

  return { message: "Parameter linked successfully." };
};

// UNLINK PARAMETER FROM ACCESSORY
exports.unlinkParameter = async (adminUser, accessoryId, parameterId, ipAddress) => {
  // Check if accessory exists
  const accessory = await accessoryRepo.getAccessoryById(accessoryId);
  if (!accessory) {
    throw new Error("Accessory not found.");
  }

  // Check if parameter is linked
  const isLinked = await accessoryRepo.isParameterLinked(accessoryId, parameterId);
  if (!isLinked) {
    throw new Error("Parameter is not linked to this accessory.");
  }

  // Unlink parameter
  await accessoryRepo.unlinkParameter(accessoryId, parameterId);

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "UNLINK_PARAMETER_FROM_ACCESSORY",
    "ACCESSORY",
    accessoryId,
    ipAddress
  );

  return { message: "Parameter unlinked successfully." };
};

module.exports = exports;
