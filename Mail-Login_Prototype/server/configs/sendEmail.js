const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SERVER,
      port: Number(process.env.SMTP_PORT),
      secure: Boolean(process.env.SERCURE),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    const option = {
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(option, (req, res) => {
      console.log("email sent! SUCCESS");
      return res.status(200).json({ code: 200, msg: "Success" });
    });
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return res.status(400).json({ code: 400, msg: "email not sent" });
  }
};
