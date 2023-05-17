const bcrypt = require("bcrypt");

async function comparePasswords(password, passwordHash) {
  try {
    const match = await bcrypt.compare(password, passwordHash);
    return match;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

module.exports = { comparePasswords };