const magicService = require("../services/magic");
const { verifyJWT } = require("../utils/verifyJWT");
const {
  isEmailValid,
  isPassValid,
  isNameValid,
  hasValue,
} = require("../helpers");

const login = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }
    if (!isEmailValid(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    await magicService.login(req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const verifyLink = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(400).json({ error: "token is invalid or not found" });
    }
    const result = await verifyJWT(token);
    console.log("result >>", result);
    if (!result) {
      return res.status(400).json({ error: "token verification failed" });
    }
    await magicService.verifyLink(req, res, result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

module.exports = {
  login,
  verifyLink,
};
