const { getLocalizedText } = require("../i18n");

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createSummaryText(ctx) {
  const form = ctx.session.form;
  return (
    `${getLocalizedText(ctx.session.lang, "summary_name")}: ${escapeHtml(
      form.name || "-",
    )}\n` +
    `${getLocalizedText(ctx.session.lang, "summary_phone")}: ${escapeHtml(
      form.phone || "-",
    )}\n` +
    `${getLocalizedText(ctx.session.lang, "summary_car")}: ${escapeHtml(
      form.car_name || "-",
    )}\n` +
    `${getLocalizedText(ctx.session.lang, "summary_engine")}: ${escapeHtml(
      form.engine || "-",
    )}\n` +
    `${getLocalizedText(ctx.session.lang, "summary_vin")}: ${escapeHtml(
      form.vin || "-",
    )}\n` +
    `${getLocalizedText(ctx.session.lang, "summary_problem")}: ${escapeHtml(
      form.problem || "-",
    )}`
  );
}

function createRequestMsg(ctx) {
  const summaryText = createSummaryText(ctx);
  const form = ctx.session.form;
  const phoneDigits = (form.phone || "").replace(/\D/g, "");

  let phoneCallPart = "";
  if (phoneDigits.startsWith("48") && phoneDigits.length >= 9) {
    phoneCallPart = `\n\n📞 <a href="tel:+${phoneDigits}">${escapeHtml(
      form.phone,
    )}</a>`;
  }

  const u = ctx.from;
  return [
    `=== НОВАЯ ЗАЯВКА ===`,
    summaryText + phoneCallPart,
    "=== TELEGRAM INFO ===",
    `Client ID: ${u.id}`,
    `Username: ${u.username || "-"}`,
    `Name: ${u.first_name || "-"} ${u.last_name || "-"}`,
    `Language: ${u.language_code || "-"}`,
  ].join("\n");
}

function createSummaryTitle(ctx) {
  return `${getLocalizedText(ctx.session.lang, "summary_title")}\n\n`;
}

module.exports = { createSummaryText, createSummaryTitle, createRequestMsg };
