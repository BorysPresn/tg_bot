const { normalizePhone } = require("./validators");

const phonePattern = /^\+48\d{9}$/;
const fullNameAllowedCharsPattern = /^\p{L}+(?:[-' ]\p{L}+)*$/u;

const validateCallbackForm = (data = {}) => {
  const errors = {};

  const fullName =
    typeof data.fullName === "string" ? data.fullName.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";

  if (!fullName) {
    errors.fullName = "Name is required";
  } else if (fullName.length > 80) {
    errors.fullName = "Name is too long";
  } else if (!fullNameAllowedCharsPattern.test(fullName)) {
    errors.fullName = "Invalid name format";
  }

  if (!phonePattern.test(phone)) {
    errors.phone = "Invalid phone format";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values: {
      fullName,
      phone: normalizePhone(phone),
    },
  };
};

module.exports = validateCallbackForm;
