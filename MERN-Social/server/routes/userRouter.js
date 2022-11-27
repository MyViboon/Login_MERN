const router = require("express").Router();
const userController = require("../controllers/userCtrl");

router.post("/register", userController.register);

module.exports = router;
