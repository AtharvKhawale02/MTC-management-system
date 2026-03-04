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
