const nodemailer = require("nodemailer");

const emailConfig = async (to, subject, html) => {
  try {
    const auth = {
      type: "OAuth2",
      user: process.env.GMAIL_ACCOUNT,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    };

    const mailOptions = {
      from: "example@gmail.com",
      to: to,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log("Error in email config ===> ", error.message);
  }
};

module.exports = emailConfig;
