const { LIMITS } = require("../config/constants");

function all(...validators) {
  return (value) => validators.every((fn) => fn(value));
}

function minLength(min) {
  return (text) => (text || "").trim().length >= min;
}

function onlyLetters(text) {
  const v = (text || "").trim();
  return /^[\p{L}\s'`]+$/u.test(v);
}

function normalizePhone(text) {
  const phone = (text || "").replace(/\D/g, "");
  return phone.replace(/\B(?=(\d{3})+(?!\d))/g, " ");;
}
function normalizeVin(text) {
  return (text || "").toUpperCase();
}

const VIN_REGEX = new RegExp(`^[A-HJ-NPR-Z0-9]{${LIMITS.VIN_MIN}}$`);
function validateVin(text) {
  if (!text) return true;
  const vin = text.trim().toUpperCase();

  return VIN_REGEX.test(vin);
}
module.exports = {
  all,
  minLength,
  onlyLetters,
  normalizePhone,
  normalizeVin,
  validateVin,
};
