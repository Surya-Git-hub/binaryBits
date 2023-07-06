const userService = require("../services/createNewUser");
const { isEmailValid, isPassValid, isNameValid } = require("../../helpers");

const createNewUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }
    if (!isEmailValid(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (!isPassValid(password)) {
      return res
        .status(400)
        .json({
          error:
            "password should contain atleast one special char,one number,one uppercase letter,one lowercase letter",
        });
    }
    if (!isNameValid(name)) {
      return res
        .status(400)
        .json({ error: "only alphabets allowed of atleast of length 3" });
    }

    await userService.createNewUser(req, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
};

module.exports = {
  createNewUser,
};
