const express = require("express");
const validateCallbackForm = require("../helpers/callbackFormValidator");
const { sendCallbackEmail } = require("../services/mail.sevices");
const { createCallbackText } = require("../helpers/textCreators");

module.exports = (bot) => {
  const router = express.Router();
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!chatId) {
    throw new Error("TELEGRAM_CHAT_ID is required");
  }

  router.post("/", async (req, res) => {
    try {
      if (req.body?.website) {
        return res.status(400).json({
          ok: false,
          message: "Spam detected",
        });
      }
      const validation = validateCallbackForm(req.body);

      if (!validation.isValid) {
        return res.status(400).json({
          ok: false,
          errors: validation.errors,
          message: "Validation failed",
        });
      }

      const text = createCallbackText(validation.values);

      const results = await Promise.allSettled([
        sendCallbackEmail(validation.values),
        bot.telegram.sendMessage(chatId, text, {
          parse_mode: "HTML",
        }),
      ]);

      const channels = ["email", "telegram"];

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(
            `Callback ${channels[index]} delivery failed:`,
            result.reason,
          );
        }
      });

      const delivered = results.some((result) => result.status === "fulfilled");

      if (!delivered) {
        return res.status(502).json({
          ok: false,
          message: "Could not deliver request",
        });
      }

      return res.status(200).json({
        ok: true,
        message: "Request received",
      });
    } catch (error) {
      console.error("Callback request failed:", error);

      return res.status(500).json({
        ok: false,
        message: "Could not send request",
      });
    }
  });
  return router;
};
