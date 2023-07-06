const userService = require("../services/userService");
const { checkVerificationLink } = require("../utils/checkVerificationLink");
const { verifyJWT } = require("../utils/verifyJWT");
const { isEmailValid, isPassValid, isNameValid } = require("../helpers");
const { hasValue } = require("../helpers/inputValidation");

const getAllUsers = async (req, res) => {
  try {
    const allusers = await userService.getAllUsers();
    return res.status(200).json({ status: "OK", data: allusers });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
};

const getOneUser = async (req, res) => {
  try {
    const { id } = req.params?.userId;
    if (!hasValue(id)) {
      return res.status(400).json({ error: "userId is required in params" });
    }
    await userService.getOneUser(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const getSomeUsers = async (req, res) => {
  try {
    const { ids } = req.query?.userIds;
    if (!hasValue(ids)) {
      return res.status(400).json({ error: "userIds are required in query" });
    }
    await userService.getSomeUsers(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const updateOneUser = async (req, res) => {
  try {
    const { name, email, password, id } = req.body;
    if (!hasValue(id)) {
      return res.status(400).json({ error: "userId is required in params" });
    }
    if (!hasValue(name) && hasValue(email) && !hasValue(password)) {
      return res
        .status(400)
        .json({ error: "something is required update something" });
    }
    await userService.updateOneUser(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const updateAllUsers = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!hasValue(name) && hasValue(email) && !hasValue(password)) {
      return res
        .status(400)
        .json({ error: "something is required update something" });
    }
    return res
      .status(400)
      .json({ error: "don't know why i created this mess" });
    await userService.updateAllUsers(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const updateSomeUsers = async (req, res) => {
  try {
    const { name, email, password, userIds } = req.body;
    if (!hasValue(id)) {
      return res.status(400).json({ error: "userIds are required in params" });
    }
    if (!hasValue(name) && hasValue(email) && !hasValue(password)) {
      return res
        .status(400)
        .json({ error: "something is required update something" });
    }
    await userService.updateSomeUsers(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const deleteOneUser = async (req, res) => {
  try {
    const { id } = req.params?.userId;
    if (!hasValue(id)) {
      return res.status(400).json({ error: "userId is required in params" });
    }
    await userService.deleteOneUser(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const deleteSomeUsers = async (req, res) => {
  try {
    const { ids } = req.query?.userIds;
    if (!hasValue(ids)) {
      return res.status(400).json({ error: "userIds are required in query" });
    }
    await userService.deleteSomeUsers(req, res);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const deleteAllUsers = async (req, res) => {
  try {
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: error });
  }
};

const createNewUser = async (req, res) => {
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

    await userService.createNewUser(req, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
};

const userLogin = async (req, res) => {
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
    await userService.userLogin(req, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;
    if (!hasValue(token)) {
      return res.status(400).json({ error: "token is invalid or not found" });
    }
    const result = await checkVerificationLink(token);
    if (!result.match) {
      return res.status(400).json({ error: "token not matched" });
    }
    await userService.verifyEmail(req, res, result);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: error });
  }
};

const reVerifyEmail = async (req, res) => {
  try {
    await userService.reVerifyEmail(req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const magicLogin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    await userService.magicLogin(req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const verifyMagicLink = async (req, res) => {
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
    await userService.verifyMagicLink(req, res, result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const createProfile = async (req, res) => {
  try {
    const { profession, bio, imageFile } = req.body;
    if (!hasValue(profession) && !hasValue(bio) && !hasValue(imageFile)) {
      return res
        .status(200)
        .json({ status: "Nothing saved because nothing to save" });
    }
    const professionRegex = /^[a-zA-Z\s]+$/;
    const bioRegex = /^.{0,150}$/;
    if (!professionRegex.test(profession) && profession !== "") {
      return res.status(400).json({ error: "profession is invalid" });
    }
    if (!bioRegex.test(bio) && bio !== "") {
      return res.status(400).json({ error: "bio is invalid" });
    }
    if (imageFile) {
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".svg", ".img"];
      const fileExtension = imageFile.originalname
        .split(".")
        .pop()
        .toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ error: "Invalid imageFile extension" });
      }
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (imageFile.size > maxSize) {
        return res.status(400).json({ error: "File size exceeds the limit" });
      }
    }

    await userService.createProfile(req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  getSomeUsers,
  createNewUser,
  userLogin,
  verifyEmail,
  reVerifyEmail,
  magicLogin,
  verifyMagicLink,
  createProfile,
  updateOneUser,
  updateSomeUsers,
  updateAllUsers,
  deleteOneUser,
  deleteSomeUsers,
  deleteAllUsers,
};
