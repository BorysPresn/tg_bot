const { normalizePhone } = require("./validators");

const phonePattern = /^\+48\d{9}$/;
const vinAllowedCharsPattern = /^[A-HJ-NPR-Z0-9]+$/i;
const forbiddenVinCharsPattern = /[IOQ]/i;

const validateContactForm = (data = {}) => {
  const errors = {};

  const fullName =
    typeof data.fullName === "string" ? data.fullName.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const vin = typeof data.vin === "string" ? data.vin.trim().toUpperCase() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  const consent = data.consent === true;

  if (!fullName) {
    errors.fullName = "Full name is required";
  } else if (fullName.length > 80) {
    errors.fullName = "Full name is too long";
  }

  if (!phonePattern.test(phone)) {
    errors.phone = "Invalid phone format";
  }

  if (!vin) {
    errors.vin = "VIN is required";
  } else if (vin.length !== 17) {
    errors.vin = "VIN must be 17 characters";
  } else if (
    forbiddenVinCharsPattern.test(vin) ||
    !vinAllowedCharsPattern.test(vin)
  ) {
    errors.vin = "Invalid VIN format";
  }

  if (!message) {
    errors.message = "Message is required";
  } else if (message.length > 1000) {
    errors.message = "Message is too long";
  }

  if (!consent) {
    errors.consent = "Consent is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values: {
      fullName,
      phone: normalizePhone(phone),
      vin,
      message,
      consent,
    },
  };
};

module.exports = validateContactForm;
