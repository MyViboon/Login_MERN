const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLATGROUND = "https://developers.google.com/oauthplayground";

const {
  MAILING_SECRET_CLIENT_ID,
  MAILING_SECRET_CLIENT_SECRET,
  MAILING_SECRET_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS,
} = process.env;

const oauth2Client = new OAuth2(
  MAILING_SECRET_CLIENT_ID,
  MAILING_SECRET_CLIENT_SECRET,
  MAILING_SECRET_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS
);

const sendMail = (to, url) => {
  oauth2Client.setCredentials({
    refresh_token: MAILING_SECRET_REFRESH_TOKEN,
  });
  const accesToken = oauth2Client.getAccessToken();
  const smtpTransport = nodemailer.createTestAccount({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: SENDER_EMAIL_ADDRESS,
      clientId: MAIL,
    },
  });
};

module.exports = sendMail;
