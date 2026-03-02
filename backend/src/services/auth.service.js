const userRepo = require("../repositories/user.repository");
const { comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/token");

exports.login = async (email, password) => {
  const user = await userRepo.findByEmail(email);

  if (!user) {
    throw new Error("Invalid username or password. Please try again.");
  }

  const isMatch = await comparePassword(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid username or password. Please try again.");
  }

  const token = generateToken(user);

  await userRepo.updateSessionToken(user.id, token);

  return { user, token };
};