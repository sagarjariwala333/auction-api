require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, "aucton", {
    expiresIn: 3 * 24 * 60 * 60,
  });
};