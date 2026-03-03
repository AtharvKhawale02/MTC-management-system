const userRepo = require("../repositories/user.repository");
const { hashPassword } = require("../utils/hash");
const auditRepo = require("../repositories/audit.repository");

exports.createUser = async (adminUser, userData, ipAddress) => {
  const { name, email, password, role, unit_id } = userData;

  // Admin cannot create another admin (optional restriction)
  if (role === "admin" && adminUser.role !== "admin") {
    throw new Error("Only admin can create another admin.");
  }

  // Sales & Quality must have unit_id
  if ((role === "sales" || role === "quality") && !unit_id) {
    throw new Error("Unit is required for Sales and Quality users.");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format.");
  }

  // Validate password requirements
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error("Password must be at least 8 characters with at least one number and one special character.");
  }

  // Check email uniqueness
  const existingUser = await userRepo.findByEmailForCreate(email);
  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  const newUser = await userRepo.createUser({
    name,
    email,
    password_hash: hashedPassword,
    role,
    unit_id: role === "admin" ? null : unit_id
  });

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "CREATE_USER",
    "USER",
    newUser.insertId,
    ipAddress
  );

  return newUser;
};

exports.resetPassword = async (adminUser, userId, newPassword, ipAddress) => {
  const hashedPassword = await hashPassword(newPassword);

  await userRepo.updatePassword(userId, hashedPassword);

  await auditRepo.logAction(
    adminUser.id,
    "RESET_PASSWORD",
    "USER",
    userId,
    ipAddress
  );

  return true;
};

// ✅ GET ALL USERS WITH PAGINATION
exports.getAllUsers = async (page = 1, limit = 20) => {
  return await userRepo.getAllUsers(page, limit);
};

// ✅ GET USER BY ID
exports.getUserById = async (userId) => {
  const user = await userRepo.getUserById(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
};

// ✅ UPDATE USER
exports.updateUser = async (adminUser, userId, userData, ipAddress) => {
  const { name, email, password, role, unit_id, is_active } = userData;

  // Check if user exists
  const existingUser = await userRepo.getUserById(userId);
  if (!existingUser) {
    throw new Error("User not found.");
  }

  // Admin cannot modify another admin (optional restriction)
  if (role === "admin" && adminUser.role !== "admin") {
    throw new Error("Only admin can modify another admin.");
  }

  // Sales & Quality must have unit_id
  if ((role === "sales" || role === "quality") && !unit_id) {
    throw new Error("Unit is required for Sales and Quality users.");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format.");
  }

  // Check email uniqueness (excluding current user)
  const emailExists = await userRepo.findByEmailExcludingUser(email, userId);
  if (emailExists) {
    throw new Error("A user with this email already exists.");
  }

  // Validate password if provided
  let hashedPassword = null;
  if (password && password.trim() !== "") {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error("Password must be at least 8 characters with at least one number and one special character.");
    }
    hashedPassword = await hashPassword(password);
  }

  // Update user
  await userRepo.updateUser(userId, {
    name,
    email,
    password_hash: hashedPassword,
    role,
    unit_id: role === "admin" ? null : unit_id,
    is_active
  });

  // Audit log
  await auditRepo.logAction(
    adminUser.id,
    "UPDATE_USER",
    "USER",
    userId,
    ipAddress
  );

  return true;
};

// ✅ DELETE USER
exports.deleteUser = async (adminUser, userId, ipAddress) => {
  // Check if user exists
  const existingUser = await userRepo.getUserById(userId);
  if (!existingUser) {
    throw new Error("User not found.");
  }

  // Check if user has created any records
  const hasRecords = await userRepo.checkUserHasRecords(userId);

  if (hasRecords) {
    // Deactivate instead of delete
    await userRepo.deactivateUser(userId);

    // Audit log
    await auditRepo.logAction(
      adminUser.id,
      "DEACTIVATE_USER",
      "USER",
      userId,
      ipAddress
    );

    return {
      deleted: false,
      deactivated: true,
      message: "User has existing records. Account has been deactivated instead of deleted."
    };
  } else {
    // Hard delete
    await userRepo.deleteUser(userId);

    // Audit log
    await auditRepo.logAction(
      adminUser.id,
      "DELETE_USER",
      "USER",
      userId,
      ipAddress
    );

    return {
      deleted: true,
      deactivated: false,
      message: "User deleted successfully."
    };
  }
};

// ✅ GET ALL UNITS
exports.getUnits = async () => {
  return await userRepo.getUnits();
};