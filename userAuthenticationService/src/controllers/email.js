const emailService = require("../services/email");
const { checkVerificationLink } = require("../utils/checkVerificationLink");
const {
  isEmailValid,
  isPassValid,
  isNameValid,
  hasValue,
} = require("../helpers");

const verify = async (req, res) => {
  try {
    const token = req.query.token;
    if (!hasValue(token)) {
      return res.status(400).json({ error: "token is invalid or not found" });
    }
    const result = await checkVerificationLink(token);
    if (!result.match) {
      return res.status(400).json({ error: "token not matched" });
    }
    await emailService.verify(req, res, result);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
};

const reVerify = async (req, res) => {
  try {
    await emailService.reVerify(req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

module.exports = {
  verify,
  reVerify,
};
