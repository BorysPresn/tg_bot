const { getLocalizedText } = require("../i18n");

function createSummaryText(ctx) {
  return (
    `${getLocalizedText(ctx.session.lang, "summary_name")}: ${
      ctx.session.form.name || "-"
    }\n` +
    `${getLocalizedText(ctx.session.lang, "summary_phone")}: ${
      ctx.session.form.phone || "-"
    }\n` +
    `${getLocalizedText(ctx.session.lang, "summary_car")}: ${
      ctx.session.form.car_name || "-"
    }\n` +
    `${getLocalizedText(ctx.session.lang, "summary_engine")}: ${
      ctx.session.form.engine || "-"
    }\n` +
    `${getLocalizedText(ctx.session.lang, "summary_vin")}: ${
      ctx.session.form.vin || "-"
    }\n` +
    `${getLocalizedText(ctx.session.lang, "summary_problem")}: ${
      ctx.session.form.problem || "-"
    }`
  );
}

function createSummaryTitle(ctx) {
  return `${getLocalizedText(ctx.session.lang, "summary_title")}\n\n`;
}

function createRequestMsg(ctx) {
  const u = ctx.from;
  return [
  `=== НОВАЯ ЗАЯВКА ===\n`,
  createSummaryText(ctx),
  "\n=== TELEGRAM INFO ===\n",
  `Client ID: ${u.id}`,
  `Username: ${u.username || "-"}`,
  `Name: ${u.first_name || "-"} ${u.last_name || "-"}`,
  `Language: ${u.language_code || "-"}`
  ].join("\n");
}
module.exports = { createSummaryText, createSummaryTitle, createRequestMsg };
