const valveRepo = require("../repositories/valve.repository");
const auditRepo = require("../repositories/audit.repository");

//  GET ALL VALVE TYPES
exports.getAllValveTypes = async () => {
  return await valveRepo.getAllValveTypes();
};

// GET VALVE TYPE BY ID
exports.getValveTypeById = async (id) => {
  const valveType = await valveRepo.getValveTypeById(id);
  if (!valveType) {
    throw new Error("Valve type not found.");
  }
  return valveType;
};

//  CREATE VALVE TYPE
exports.createValveType = async (adminUser, name, ipAddress) => {
  // Validate name
  if (!name || name.trim() === "") {
    throw new Error("Valve type name is required.");
  }

  const trimmedName = name.trim();

  if (trimmedName.length > 100) {
    throw new Error("Valve type name must not exceed 100 characters.");
  }

  // Check for duplicate name
  const existingValveType = await valveRepo.findByName(trimmedName);
  if (existingValveType) {
    throw new Error("Valve type already exists.");
  }

  // Create valve type
  const result = await valveRepo.createValveType(trimmedName);

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "CREATE_VALVE_TYPE",
    "VALVE_TYPE",
    result.insertId,
    ipAddress
  );

  return result;
};

// UPDATE VALVE TYPE
exports.updateValveType = async (adminUser, id, name, ipAddress) => {
  // Check if valve type exists
  const existingValveType = await valveRepo.getValveTypeById(id);
  if (!existingValveType) {
    throw new Error("Valve type not found.");
  }

  // Validate name
  if (!name || name.trim() === "") {
    throw new Error("Valve type name is required.");
  }

  const trimmedName = name.trim();

  if (trimmedName.length > 100) {
    throw new Error("Valve type name must not exceed 100 characters.");
  }

  // Check for duplicate name (excluding current valve type)
  const duplicateValveType = await valveRepo.findByNameExcludingId(trimmedName, id);
  if (duplicateValveType) {
    throw new Error("Valve type already exists.");
  }

  // Update valve type
  await valveRepo.updateValveType(id, trimmedName);

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "UPDATE_VALVE_TYPE",
    "VALVE_TYPE",
    id,
    ipAddress
  );

  return true;
};

//  DELETE VALVE TYPE
exports.deleteValveType = async (adminUser, id, ipAddress) => {
  // Check if valve type exists
  const existingValveType = await valveRepo.getValveTypeById(id);
  if (!existingValveType) {
    throw new Error("Valve type not found.");
  }

  // Check if valve type is used in TCDS records
  const isUsedInTCDS = await valveRepo.isUsedInTCDS(id);
  if (isUsedInTCDS) {
    throw new Error("Cannot delete valve type because it is used in existing TCDS records.");
  }

  // Check if valve type has parameters
  const hasParameters = await valveRepo.hasParameters(id);
  if (hasParameters) {
    throw new Error("Cannot delete valve type because it has associated parameters.");
  }

  // Delete valve type
  await valveRepo.deleteValveType(id);

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "DELETE_VALVE_TYPE",
    "VALVE_TYPE",
    id,
    ipAddress
  );

  return { message: "Valve type deleted successfully." };
};

//  GET PARAMETERS FOR VALVE TYPE
exports.getValveTypeParameters = async (valveTypeId) => {
  // Check if valve type exists
  const valveType = await valveRepo.getValveTypeById(valveTypeId);
  if (!valveType) {
    throw new Error("Valve type not found.");
  }
  
  return await valveRepo.getValveTypeParameters(valveTypeId);
};

//  GET AVAILABLE PARAMETERS (NOT LINKED)
exports.getAvailableParameters = async (valveTypeId) => {
  // Check if valve type exists
  const valveType = await valveRepo.getValveTypeById(valveTypeId);
  if (!valveType) {
    throw new Error("Valve type not found.");
  }
  
  return await valveRepo.getAvailableParameters(valveTypeId);
};

//  LINK PARAMETER TO VALVE TYPE
exports.linkParameter = async (adminUser, valveTypeId, parameterId, ipAddress) => {
  // Check if valve type exists
  const valveType = await valveRepo.getValveTypeById(valveTypeId);
  if (!valveType) {
    throw new Error("Valve type not found.");
  }
  
  // Check if parameter is already linked
  const isLinked = await valveRepo.isParameterLinked(valveTypeId, parameterId);
  if (isLinked) {
    throw new Error("Parameter is already linked to this valve type.");
  }
  
  // Link parameter
  await valveRepo.linkParameter(valveTypeId, parameterId);
  
  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "LINK_PARAMETER",
    "VALVE_TYPE",
    valveTypeId,
    ipAddress
  );
  
  return { message: "Parameter linked successfully." };
};

//  UNLINK PARAMETER FROM VALVE TYPE
exports.unlinkParameter = async (adminUser, valveTypeId, parameterId, ipAddress) => {
  // Check if valve type exists
  const valveType = await valveRepo.getValveTypeById(valveTypeId);
  if (!valveType) {
    throw new Error("Valve type not found.");
  }
  
  // Check if parameter is linked
  const isLinked = await valveRepo.isParameterLinked(valveTypeId, parameterId);
  if (!isLinked) {
    throw new Error("Parameter is not linked to this valve type.");
  }
  
  // Unlink parameter
  await valveRepo.unlinkParameter(valveTypeId, parameterId);
  
  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "UNLINK_PARAMETER",
    "VALVE_TYPE",
    valveTypeId,
    ipAddress
  );
  
  return { message: "Parameter unlinked successfully." };
};
