const nodemailer = require("nodemailer");
const emailConfig = require("../config/email");

const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: emailConfig.auth,
});

async function sendEmail({ subject, text }) {
  await transporter.sendMail({
    from: emailConfig.from,
    to: emailConfig.to,
    subject,
    text,
  });
}

module.exports = { sendEmail };
