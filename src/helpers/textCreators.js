const { getLocalizedText } = require("../i18n");

function createSummaryText(ctx) {
  const form = ctx.session.form;
  return (
    `${getLocalizedText(ctx.session.lang, "summary_name")}: ${
      form.name || "-"
    }\n` +
    `${getLocalizedText(ctx.session.lang, "summary_phone")}: ${
      form.phone || "-"
    }\n` +
    `${getLocalizedText(ctx.session.lang, "summary_car")}: ${
      form.car_name || "-"
    }\n` +
    `${getLocalizedText(ctx.session.lang, "summary_engine")}: ${
      form.engine || "-"
    }\n` +
    `${getLocalizedText(ctx.session.lang, "summary_vin")}: ${
      form.vin || "-"
    }\n` +
    `${getLocalizedText(ctx.session.lang, "summary_problem")}: ${
      form.problem || "-"
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
    `Language: ${u.language_code || "-"}`,
  ].join("\n");
}
module.exports = { createSummaryText, createSummaryTitle, createRequestMsg };
