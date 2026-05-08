const { Markup } = require("telegraf");
const ui = require("../config/ui");
const { getLocalizedText } = require("../i18n");
const { createSummaryText, createSummaryTitle } = require("./textCreators");

function renderInlineKeyboard(ctx, menu) {
  const lang = ctx.session.lang;

  const buttons = menu.buttons
    .filter((btn) => btn.type === "inline")
    .map((btn) => {
      if (btn.action) {
        return Markup.button.callback(
          getLocalizedText(lang, btn.textKey),
          btn.action,
        );
      }
      if (btn.value) {
        return Markup.button.callback(
          getLocalizedText(lang, btn.textKey),
          `LANG_${btn.value}`,
        );
      }
    });

  return Markup.inlineKeyboard(buttons, { columns: 1 }); //menu.colls
}
async function removeInlineKeyboard(ctx) {
  try {
    await ctx.editMessageReplyMarkup(undefined);
  } catch (error) {
    console.error("Error while removing inline buttons", error?.message || error);
  }
}
function renderInlineMenu(ctx, menu) {
  return ctx.reply(
    getLocalizedText(ctx.session.lang, menu.textKey),
    renderInlineKeyboard(ctx, menu),
  );
}

function sendMainMenu(ctx) {
  return renderInlineMenu(ctx, ui.main);
}

function sendChangeLangMenu(ctx) {
  return renderInlineMenu(ctx, ui.changeLanguage);
}

function renderOptional(ctx) {
  return renderInlineKeyboard(ctx, ui.optional);
}

function renderKeepButton(ctx) {
  return renderInlineKeyboard(ctx, ui.keep)
}

function renderContactButton(ctx) {
  return Markup.button.contactRequest(
    getLocalizedText(ctx.session.lang, ui.contact.textKey),
  );
}
function showSummaryMenu(ctx) {
  const title = createSummaryTitle(ctx);
  const text = createSummaryText(ctx);
  const msg = title + text;
  return ctx.reply(msg, renderInlineKeyboard(ctx, ui.summary));
}

module.exports = {
  removeInlineKeyboard,
  sendMainMenu,
  sendChangeLangMenu,
  showSummaryMenu,
  renderOptional,
  renderKeepButton,
  renderContactButton,
};
