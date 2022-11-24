const nodemailer = require("nodemailer");

exports.generateOTP = () => {
  let otp = "";
  for (let i = 0; i <= 3; i++) {
    const randVal = Math.round(Math.random() * 9);
    otp = otp + randVal;
  }
  return otp;
};

exports.mailTransrort = () =>
  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

exports.generateEmailTemplate = (code) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    </head>
        <body>
           <div style="text-align: center;">
            <h1>Hello Verify</h1>
            <p>${code}</p>
           </div>
        </body>
    </html>
    `;
};

exports.plainEmailTemplate = (heading, message) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    </head>
        <body>
        <div style="text-align: center;">
            <h1>${heading}</h1>
            <p>${message}</p>
        </div>
        </body>
    </html>
    `;
};

exports.generatePasswordResetTemplate = (url) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      </head>
          <body>
             <div style="text-align: center;">
              <h1>Password Reset</h1>
             <div style="text-align: center;">
             <a href="${url}" style=" 
                margin: 0 auto;
                padding: 20px;
                text-align: center;
                background: #e63946;
                border-radius: 5px;
                font-size: 20px 10xpx;
                color: #fff;
                display: inline-block;
                cursor: pointer;
                text-decoration: none;
                font-family: sans-serif;"
            >Reset</a>
             </div>
             </div>
          </body>
      </html>
      `;
  };
