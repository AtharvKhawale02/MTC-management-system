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