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

  const u = ctx.from;
  const senderName = `${u.first_name || "-"} ${u.last_name || ""}`.trim();
  const senderLink = `<a href="tg://user?id=${u.id}">${escapeHtml(senderName)}</a>`;

  return [
    `=== НОВАЯ ЗАЯВКА ===`,
    summaryText,
    "\n=== TELEGRAM INFO ===",
    `Client ID: ${u.id}`,
    `Username: ${u.username || "-"}`,
    `Contact: ${senderLink}`,
    `Name: ${escapeHtml(senderName || "-")}`,
    `Language: ${u.language_code || "-"}`,
  ].join("\n");
}

function createSummaryTitle(ctx) {
  return `${getLocalizedText(ctx.session.lang, "summary_title")}\n\n`;
}

module.exports = { createSummaryText, createSummaryTitle, createRequestMsg };
