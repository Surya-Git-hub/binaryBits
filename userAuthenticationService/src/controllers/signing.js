const signingService = require("../services/signing");
const {
  isEmailValid,
  isPassValid,
  isNameValid,
  hasValue,
} = require("../helpers");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!hasValue(email, password, name)) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
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

    if (!isNameValid(name)) {
      return res
        .status(400)
        .json({ error: "only alphabets allowed of atleast of length 3" });
    }

    await signingService.register(req, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!hasValue(email, password)) {
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
    await signingService.login(req, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
};

const sendRegisterlink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!hasValue(email)) {
      return res.status(400).json({ error: "email is required" });
    }
    if (!isEmailValid(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    await signingService.sendRegisterlink(req, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
}

const verifyToken = async (req,res)=>{
  try {
    const { token } = req.body;
    if (!hasValue(token)) {
      return res.status(400).json({ error: "token is required" });
    }
    await signingService.verifyToken(req, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
}


module.exports = {
  register,
  login,
  sendRegisterlink,
  verifyToken,
};
