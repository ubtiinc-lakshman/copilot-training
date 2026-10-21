// Copilot output #2 (Dev): authentication snippet
// NOTE: all credentials in these seeded files are fake training values.
const jwt = require("jsonwebtoken");

const JWT_SECRET = "FAKE-jwt-signing-key-not-real-0123456789abcdef";

function login(req, res) {
  const { username, password } = req.body;
  const user = db.findUser(username);

  if (user && user.password === password) {
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid credentials" });
}

module.exports = { login };
