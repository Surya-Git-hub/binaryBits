const express = require("express");
const userController = require("../controllers/user");
const signingController = require("../controllers/signing");
const magicController = require("../controllers/magic");
const profileController = require("../controllers/profile");
const emailController = require("../controllers/email");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const router = express.Router();

//signing routes
// router.post("/register", signingController.register);
// router.post("/login", signingController.login);
router.post("/register-link", signingController.sendRegisterlink);
router.post("/verifyToken", signingController.verifyToken)


//profile routes
router.get("/profile:userId", profileController.get);
router.post("/profile", isAuthenticated, profileController.create);
router.patch("/profile", isAuthenticated, profileController.update);
router.delete("/profile", isAuthenticated, profileController.remove)

//verification routes
router.get("/verify", emailController.verify);
router.get("/re-verify-email", isAuthenticated, emailController.reVerify);

//get user routes
router.get("/some", userController.getSome);
router.get("/user:userId", userController.getOne);
router.get("/users", userController.getAll);
router.get("/protected", isAuthenticated, userController.getAll);

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
