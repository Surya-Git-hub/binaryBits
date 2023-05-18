const express = require("express");
const userController = require('../controllers/userController');
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const router = express.Router();

router.get("/", userController.getAllUsers);

router.get("/verify", userController.verifyEmail);
router.get("/reVerifyEmail",isAuthenticated,userController.reVerifyEmail)

router.get("/protected", isAuthenticated, isEmailVerified, userController.getAllUsers);


// router.get("/:user-id", userController.getOneUser);

router.post("/sign-up", userController.createNewUser);

router.post("/login", userController.userLogin);

// router.post("/sign-in", userController.createNewUser);

// router.patch("/:user-id", userController.updateOneUser);

// router.delete("/:user-id", userController.deleteOneUser);


module.exports = router;