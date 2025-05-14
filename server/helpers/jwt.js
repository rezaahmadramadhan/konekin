const { sign, verify } = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function signToken({ id }) {
  return sign({ id }, JWT_SECRET);
}

function verifyToken(token) {
  return verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken };
