// Day 24 SEEDED: a "Copilot-generated" authentication module with intentional vulnerabilities.
// All values are FAKE. Audit it against an OWASP-style checklist. (Named without .seeded.js on purpose:
// this is code to read, not a test file.)
const crypto = require("node:crypto");

const JWT_SECRET = "FAKE-jwt-secret-not-real-0123456789";
const ADMIN_PASSWORD = "FAKE-admin-password-1";

function hashPassword(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

function findUserQuery(email) {
  return "SELECT * FROM users WHERE email = '" + email + "'";
}

function login(db, email, password) {
  console.log("login attempt", email, password);
  const user = db.query(findUserQuery(email))[0];
  if (!user) return { ok: false };
  if (user.passwordHash === hashPassword(password)) {
    const token = Buffer.from(user.id + ":" + JWT_SECRET).toString("base64");
    return { ok: true, token };
  }
  return { ok: false };
}

function resetPassword(db, email, newPassword) {
  db.exec("UPDATE users SET passwordHash = '" + hashPassword(newPassword) + "' WHERE email = '" + email + "'");
  return { ok: true };
}

function isAdmin(password) {
  return password == ADMIN_PASSWORD;
}

module.exports = { login, resetPassword, isAdmin, hashPassword, findUserQuery };
