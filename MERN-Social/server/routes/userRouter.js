const router = require("express").Router();
const userController = require("../controllers/userCtrl");

router.post("/register", userController.register);

router.post("/activatoin", userController.activateEmail);

router.post("/login", userController.login);

module.exports = router;
