const express = require("express");
const userController = require('../controllers/userController');
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const router = express.Router();

router.get("/", userController.getAllUsers);

router.get("/verify", userController.verifyEmail);
router.get("/re-verify-email",isAuthenticated,userController.reVerifyEmail)
router.get("/verify-magic-link",userController.verifyMagicLink)
router.post("/magic-login",userController.magicLogin);

router.get("/protected", isAuthenticated, isEmailVerified, userController.getAllUsers);


// router.get("/:user-id", userController.getOneUser);

router.post("/sign-up", userController.createNewUser);

router.post("/login", userController.userLogin);
router.post("/create-profile",isAuthenticated,isEmailVerified,userController.createProfile)

// router.post("/sign-in", userController.createNewUser);

// router.patch("/:user-id", userController.updateOneUser);

// router.delete("/:user-id", userController.deleteOneUser);


module.exports = router;