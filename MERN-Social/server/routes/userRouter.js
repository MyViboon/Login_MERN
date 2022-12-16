const router = require("express").Router();
const userController = require("../controllers/userCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/register", userController.register);

router.post("/activation", userController.activateEmail);

router.post("/login", userController.login);

router.post("/refresh_token", userController.getAsseteToken);

router.post("/forgot", userController.forgotPassword);

router.post("/reset", auth, userController.resetPassword);

router.get("/infor", auth, userController.getUserInfor);

router.get("/all_infor", auth, authAdmin, userController.getUserAllInfor);

router.get("/logout", userController.logout);

router.patch("/update", auth, userController.updateUser);

router.patch("/update_role/:id", auth, authAdmin, userController.updateUserRole);

router.delete("/delete/:id", auth, authAdmin, userController.deleteUser);

//Social login
router.post("/login_google", userController.googleLogin);

module.exports = router;
