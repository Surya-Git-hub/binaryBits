const userService = require("../services/userService");
const { isEmailValid, isPassValid } = require("../../helpers");

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }
    if (!isEmailValid(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (!isPassValid(password)) {
      return res.status(400).json({
        error:
          "password should contain atleast one special char,one number,one uppercase letter,one lowercase letter",
      });
    }
    await userService.userLogin(req, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
};

module.exports = {
  userLogin,
};
