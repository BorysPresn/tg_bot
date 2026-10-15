const { Resend } = require("resend");
const { createContactEmailHtml } = require("../helpers/createContactEmailHtml");
const {
  createCallbackEmailHtml,
} = require("../helpers/createCallbackEmailHtml");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendContactEmail = async (formData) => {
  const { data, error } = await resend.emails.send({
    from: `Сайт Serwis S.O.M. <${process.env.MAIL_FROM}>`,
    to: [process.env.MAIL_TO],
    subject: "Новая заявка с сайта",
    html: createContactEmailHtml(formData),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const sendCallbackEmail = async (formData) => {
  const { data, error } = await resend.emails.send({
    from: `Promo сайт Serwis S.O.M. <${process.env.MAIL_FROM}>`,
    to: [process.env.MAIL_TO],
    subject: "Заявка на обратный звонок с Promo сайта",
    html: createCallbackEmailHtml(formData),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  sendContactEmail,
  sendCallbackEmail,
};
