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
  return (text || "").replace(/\D/g, "");
}
function normalizeVin(text) {
  return (text || "").toUpperCase();
}

module.exports = { all, minLength, onlyLetters, normalizePhone, normalizeVin };
