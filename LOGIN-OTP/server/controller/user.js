const User = require("../model/user");
const VerificationToken = require("../model/verificationToken");
const ResetToken = require("../model/resetToken");
const jwt = require("jsonwebtoken");
const { sendError, createRandomBytes } = require("../utils/helper");
const {
  generateOTP,
  mailTransrort,
  generateEmailTemplate,
  plainEmailTemplate,
  generatePasswordResetTemplate,
} = require("../utils/mail");
const { isValidObjectId } = require("mongoose");

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) return sendError(res, "This email is already exixts!");
  const newUser = new User({
    name,
    email,
    password,
  });

  const OTP = generateOTP();
  const verificationToken = new VerificationToken({
    owner: newUser._id,
    token: OTP,
  });

  await verificationToken.save();
  await newUser.save();

  mailTransrort().sendMail({
    from: "testVarification@gmail.com",
    to: newUser.email,
    subject: "Verify your email account",
    html: generateEmailTemplate(OTP),
  });

  res.send(newUser);
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim())
    return sendError(res, "email/password is missing!");

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "User not found!");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return sendError(res, "email/password do not match!");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    success: true,
    user: { name: user.name, email: user.email, id: user._id, token: token },
  });
};

exports.verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp.trim())
    return sendError(res, "Invalid requiest, missing parameter");

  if (!isValidObjectId(userId))
    return sendError(res, "Invalid requiest, User Id");

  const user = await User.findById(userId);
  if (!user) return sendError(res, "Sorry! User not found");

  if (user.verified) return sendError(res, "This account is already verified");

  const token = await VerificationToken.findOne({ owner: user._id });
  if (!token) sendError(res, "Sorry2! User not found");

  const isMatched = await token.compareToken(otp);
  if (!isMatched) sendError(res, "Please provide a valid token");

  user.verified = true;

  await VerificationToken.findByIdAndDelete(token._id);
  await user.save();

  mailTransrort().sendMail({
    from: "testVarification@gmail.com",
    to: user.email,
    subject: "Welcome Email",
    html: plainEmailTemplate(
      "Email verified Successfully",
      "Thanks for connecting with us"
    ),
  });
  res.json({
    success: true,
    message: "your Email is Verified",
    user: { name: user.name, email: user.email, id: user._id },
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, "Please provider a vaild email!");

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "User not found, invalid Requests");

  const token = await ResetToken.findOne({ owner: user._id });
  if (token)
    return sendError(res, "Only after one hour can request for another token");

  const randomBytes = await createRandomBytes();
  const resetToken = new ResetToken({ owner: user._id, token: randomBytes });
  await resetToken.save();

  mailTransrort().sendMail({
    from: "security@gmail.com",
    to: user.email,
    subject: "Password Reset",
    html: generatePasswordResetTemplate(
      `http://localhost:3000/reset-password?token=${randomBytes}&id=${user._id}`
    ),
  });
  res.json({
    success: true,
    message: "Password reset link is send to your email.",
  });

};

exports.resetPassword = async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) return sendError(res, "user not found!");

  const isSamePaasword = await user.comparePassword(password);
  if (isSamePaasword) return sendError(res, "New Password must be diferent");

  if (password.trim().length < 8 || password.trim().length > 20)
    return sendError(res, "New Password must be 8 to 20 character long!");

  user.password = password.trim();
  await user.save();

  await ResetToken.findOneAndDelete({ owner: user._id });

  mailTransrort().sendMail({
    from: "security@gmail.com",
    to: user.email,
    subject: "Password Reset Successfullt!",
    html: plainEmailTemplate(
      "Password reset Successfully",
      "Now you can login with new Password!"
    ),
  });
  
  res.json({ success: true, message: "Password reset Successfully" });
};