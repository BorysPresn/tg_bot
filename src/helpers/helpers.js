const { LANGUAGES, DEFAULT_LANG } = require("../config/constants");

function initSession(ctx) {
  if (!ctx.session) ctx.session = {};
  if (!ctx.session.lang) ctx.session.lang = detectLang(ctx);
  if (!Number.isInteger(ctx.session.stepIndex)) ctx.session.stepIndex = null;
  if (!ctx.session.form) ctx.session.form = {};
}

function detectLang(ctx) {
  const userLang = ctx.from.language_code;
  console.log("lang: ", userLang);
  if (LANGUAGES.includes(userLang)) {
    return userLang;
  }
  return DEFAULT_LANG;
}

function format(text, params = {}) {
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] ?? `{${key}}`;
  });
}

module.exports = { initSession, detectLang, format };
