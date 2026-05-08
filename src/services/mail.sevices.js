const nodemailer = require("nodemailer");
const { createContactEmailHtml } = require("../helpers/createContactEmailHtml");

const trnasporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMPT_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendContactEmail = async (data) => {
  await trnasporter.sendMail({
    from: `Сайт Serwis S.O.M. <${process.env.SMTP_USER}>`,
    to: process.env.MAIL_TO,
    subject: `Новая заявка с сайта`,
    html: createContactEmailHtml(data),
  });
};

module.exports = { sendContactEmail };
