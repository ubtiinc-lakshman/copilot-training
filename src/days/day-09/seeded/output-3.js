// Copilot output #3 (Dev): store a new user's password
const crypto = require("node:crypto");

function hashPassword(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

function registerUser(db, email, password) {
  const user = { email, passwordHash: hashPassword(password) };
  db.users.insert(user);
  return user;
}

module.exports = { hashPassword, registerUser };
