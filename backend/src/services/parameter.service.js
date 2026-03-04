const parameterRepo = require("../repositories/parameter.repository");
const auditRepo = require("../repositories/audit.repository");

// ====================
// PARAMETERS SERVICES
// ====================

// GET ALL PARAMETERS
exports.getAllParameters = async () => {
  return await parameterRepo.getAllParameters();
};

// GET PARAMETER BY ID
exports.getParameterById = async (id) => {
  const parameter = await parameterRepo.getParameterById(id);
  if (!parameter) {
    throw new Error("Parameter not found.");
  }
  return parameter;
};

// CREATE PARAMETER
exports.createParameter = async (adminUser, data, ipAddress) => {
  const { name, type, is_mandatory, validation_rule } = data;

  // Validate name
  if (!name || name.trim() === "") {
    throw new Error("Parameter name is required.");
  }

  const trimmedName = name.trim();

  if (trimmedName.length > 100) {
    throw new Error("Parameter name must not exceed 100 characters.");
  }

  // Validate type
  const validTypes = ['text', 'dropdown', 'number', 'date'];
  if (!validTypes.includes(type)) {
    throw new Error("Invalid parameter type. Must be one of: text, dropdown, number, date.");
  }

  // Check for duplicate name (case-insensitive)
  const existingParameter = await parameterRepo.findParameterByName(trimmedName);
  if (existingParameter) {
    throw new Error("Parameter with this name already exists.");
  }

  // Create parameter
  const result = await parameterRepo.createParameter(
    trimmedName,
    type,
    is_mandatory || false,
    validation_rule || null
  );

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "CREATE_PARAMETER",
    "PARAMETER",
    result.insertId,
    ipAddress
  );

  return result;
};

// UPDATE PARAMETER
exports.updateParameter = async (adminUser, id, data, ipAddress) => {
  const { name, type, is_mandatory, validation_rule } = data;

  // Check if parameter exists
  const existingParameter = await parameterRepo.getParameterById(id);
  if (!existingParameter) {
    throw new Error("Parameter not found.");
  }

  // Validate name
  if (!name || name.trim() === "") {
    throw new Error("Parameter name is required.");
  }

  const trimmedName = name.trim();

  if (trimmedName.length > 100) {
    throw new Error("Parameter name must not exceed 100 characters.");
  }

  // Validate type
  const validTypes = ['text', 'dropdown', 'number', 'date'];
  if (!validTypes.includes(type)) {
    throw new Error("Invalid parameter type. Must be one of: text, dropdown, number, date.");
  }

  // Check for duplicate name (excluding current parameter)
  const duplicateParameter = await parameterRepo.findParameterByNameExcludingId(trimmedName, id);
  if (duplicateParameter) {
    throw new Error("Parameter with this name already exists.");
  }

  // Update parameter
  await parameterRepo.updateParameter(
    id,
    trimmedName,
    type,
    is_mandatory || false,
    validation_rule || null
  );

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "UPDATE_PARAMETER",
    "PARAMETER",
    id,
    ipAddress
  );

  return true;
};

// DELETE PARAMETER
exports.deleteParameter = async (adminUser, id, ipAddress) => {
  // Check if parameter exists
  const existingParameter = await parameterRepo.getParameterById(id);
  if (!existingParameter) {
    throw new Error("Parameter not found.");
  }

  // Check if parameter is used in valve types
  const isUsedInValveTypes = await parameterRepo.isParameterUsedInValveTypes(id);
  if (isUsedInValveTypes) {
    throw new Error("Cannot delete parameter because it is assigned to one or more valve types.");
  }

  // Check if parameter is used in TCDS records
  const isUsedInTCDS = await parameterRepo.isParameterUsedInTCDS(id);
  if (isUsedInTCDS) {
    throw new Error("Cannot delete parameter because it is used in existing TCDS records.");
  }

  // Delete parameter (cascade will delete parameter values)
  await parameterRepo.deleteParameter(id);

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "DELETE_PARAMETER",
    "PARAMETER",
    id,
    ipAddress
  );

  return { message: "Parameter deleted successfully." };
};

// ====================
// PARAMETER VALUES SERVICES
// ====================

// GET ALL VALUES FOR A PARAMETER
exports.getParameterValues = async (parameterId) => {
  // Check if parameter exists
  const parameter = await parameterRepo.getParameterById(parameterId);
  if (!parameter) {
    throw new Error("Parameter not found.");
  }

  // Check if parameter is dropdown type
  if (parameter.type !== 'dropdown') {
    throw new Error("Parameter values are only applicable for dropdown type parameters.");
  }

  return await parameterRepo.getParameterValues(parameterId);
};

// GET PARAMETER VALUE BY ID
exports.getParameterValueById = async (valueId) => {
  const value = await parameterRepo.getParameterValueById(valueId);
  if (!value) {
    throw new Error("Parameter value not found.");
  }
  return value;
};

// CREATE PARAMETER VALUE
exports.createParameterValue = async (adminUser, parameterId, valueText, ipAddress) => {
  // Check if parameter exists
  const parameter = await parameterRepo.getParameterById(parameterId);
  if (!parameter) {
    throw new Error("Parameter not found.");
  }

  // Check if parameter is dropdown type
  if (parameter.type !== 'dropdown') {
    throw new Error("Parameter values are only applicable for dropdown type parameters.");
  }

  // Validate value
  if (!valueText || valueText.trim() === "") {
    throw new Error("Value is required.");
  }

  const trimmedValue = valueText.trim();

  if (trimmedValue.length > 200) {
    throw new Error("Value must not exceed 200 characters.");
  }

  // Check for duplicate value (case-insensitive)
  const existingValue = await parameterRepo.findParameterValueByValue(parameterId, trimmedValue);
  if (existingValue) {
    throw new Error("This value already exists for this parameter.");
  }

  // Create parameter value
  const result = await parameterRepo.createParameterValue(parameterId, trimmedValue);

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "CREATE_PARAMETER_VALUE",
    "PARAMETER_VALUE",
    result.insertId,
    ipAddress
  );

  return result;
};

// UPDATE PARAMETER VALUE
exports.updateParameterValue = async (adminUser, valueId, valueText, ipAddress) => {
  // Check if parameter value exists
  const existingValue = await parameterRepo.getParameterValueById(valueId);
  if (!existingValue) {
    throw new Error("Parameter value not found.");
  }

  // Validate value
  if (!valueText || valueText.trim() === "") {
    throw new Error("Value is required.");
  }

  const trimmedValue = valueText.trim();

  if (trimmedValue.length > 200) {
    throw new Error("Value must not exceed 200 characters.");
  }

  // Check for duplicate value (case-insensitive, excluding current value)
  const duplicateValue = await parameterRepo.findParameterValueByValueExcludingId(
    existingValue.parameter_id,
    trimmedValue,
    valueId
  );
  if (duplicateValue) {
    throw new Error("This value already exists for this parameter.");
  }

  // Update parameter value
  await parameterRepo.updateParameterValue(valueId, trimmedValue);

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "UPDATE_PARAMETER_VALUE",
    "PARAMETER_VALUE",
    valueId,
    ipAddress
  );

  return true;
};

// DELETE PARAMETER VALUE
exports.deleteParameterValue = async (adminUser, valueId, ipAddress) => {
  // Check if parameter value exists
  const existingValue = await parameterRepo.getParameterValueById(valueId);
  if (!existingValue) {
    throw new Error("Parameter value not found.");
  }

  // Check if value is used in TCDS records
  const isUsedInTCDS = await parameterRepo.isParameterValueUsedInTCDS(valueId);
  if (isUsedInTCDS) {
    throw new Error("Cannot delete - this value is used in existing records.");
  }

  // Delete parameter value
  await parameterRepo.deleteParameterValue(valueId);

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "DELETE_PARAMETER_VALUE",
    "PARAMETER_VALUE",
    valueId,
    ipAddress
  );

  return { message: "Parameter value deleted successfully." };
};
