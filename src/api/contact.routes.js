const express = require("express");
const validateContactForm = require("../helpers/contactFormValidator");
const { sendContactEmail } = require("../services/mail.sevices");

const router = express.Router();

module.exports = (bot) => {
  router.post("/", async (req, res) => {
    try {
      if (req.body.website) {
        return res.status(400).json({
          ok: false,
          message: "Spam detected",
        });
      }
      const validation = validateContactForm(req.body);

      if (!validation.isValid) {
        return res.status(400).json({
          ok: false,
          errors: validation.errors,
          message: "Validate failed",
        });
      }

      await sendContactEmail(validation.values);

      return res.status(200).json({
        ok: true,
        message: "Requset recieved",
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: `Server error: ${error.message}`,
      });
    }
  });
  return router;
};
