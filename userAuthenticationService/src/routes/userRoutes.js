const express = require("express");
const userController = require('../controllers/userController');
const router = express.Router();

router.get("/", userController.getAllUsers);

// router.get("/:user-id", userController.getOneUser);

router.post("/sign-up", userController.createNewUser);

// router.post("/sign-in", userController.createNewUser);

// router.patch("/:user-id", userController.updateOneUser);

// router.delete("/:user-id", userController.deleteOneUser);


module.exports = router;