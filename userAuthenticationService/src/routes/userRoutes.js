const express = require("express");
const userController = require("../controllers/user");
const signingController = require("../controllers/signing");
const magicController = require("../controllers/magic");
const profileController = require("../controllers/profile");
const emailController = require("../controllers/email");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const router = express.Router();

//signing routes
router.post("/register", signingController.register);
router.post("/login", signingController.login);

//magic link routes
router.post("/magic-login", magicController.login);
router.get("/verify-magic-link", magicController.verifyLink);

//profile routes
router.post("/create-profile",isAuthenticated,isEmailVerified,profileController.create);

//get user routes
router.get("/some", userController.getSome);
router.get("/:userId", userController.getOne);
router.get("/", userController.getAll);
router.get("/protected",isAuthenticated,isEmailVerified,userController.getAll);

//verification routes
router.get("/verify", emailController.verify);
router.get("/re-verify-email", isAuthenticated, emailController.reVerify);

//user update routes
router.patch("/updateOneUser", userController.updateOne);
router.patch("/updateSomeUsers", userController.updateSome);
router.patch("/updateAllUsers", userController.updateAll);

//user delete routes
router.delete("/some", userController.deleteSome);
router.delete("/:userId", userController.deleteOne);
router.delete("/", userController.deleteAll);

//route export
module.exports = router;
