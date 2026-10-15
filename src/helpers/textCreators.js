const { getLocalizedText } = require("../i18n");
const { escapeHtml } = require("./helpers");

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
function createCallbackText(body) {
  return [
    `<b>Запрос звонка</b>`,
    `<b>Имя:</b> ${escapeHtml(body.fullName)}`,
    `<b>Телефон:</b> ${body.phone}`,
  ].join("\n");
}
module.exports = {
  createSummaryText,
  createSummaryTitle,
  createRequestMsg,
  createCallbackText,
};
