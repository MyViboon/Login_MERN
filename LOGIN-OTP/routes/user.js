const router = require("express").Router();
const {
  createUser,
  signin,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require("../controller/user");
const { isResetTokenValid } = require("../middleware/user");
const { validatorUser, validate } = require("../middleware/validator");

router.post("/create", validatorUser, validate, createUser);
router.post("/signin", signin);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", isResetTokenValid, resetPassword);

module.exports = router;
