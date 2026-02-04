module.exports = {
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },

  from: `"Serwis S.O.M. Bot" <bot@som.local>`,
  to: process.env.MAIL_TO,
};
