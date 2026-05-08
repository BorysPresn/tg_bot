const { Telegraf, session, Markup } = require("telegraf");
const { initSession, detectLang } = require("./helpers/helpers");
const {
  sendMainMenu,
  sendChangeLangMenu,
  removeInlineKeyboard,
} = require("./helpers/menu");
const {
  startFlow,
  handleInput,
  showCurrentQuestion,
  goToNextStep,
  hasActiveFlow,
  handleSessionLost,
} = require("./engine/flow");
const { message } = require("telegraf/filters");
const { getLocalizedText } = require("./i18n");
const { ACTIONS, BOT_URL } = require("./config/constants");
const { createRequestMsg } = require("./helpers/textCreators");
const steps = require("./config/steps");
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

function normalizeContactPhone(phone) {
  const digits = (phone || "").replace(/\D/g, "");

  if (digits.length === 9) return `+48${digits}`;
  if (digits.startsWith("48") && digits.length === 11) return `+${digits}`;
  if (digits.startsWith("00") && digits.length > 2) return `+${digits.slice(2)}`;

  return digits ? `+${digits}` : null;
}

function escapeVCardValue(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function createClientContact(ctx) {
  const form = ctx.session?.form || {};
  const phoneNumber = normalizeContactPhone(form.phone);
  if (!phoneNumber) return null;

  const firstName = (form.name || ctx.from?.first_name || "Client").trim();
  const username = ctx.from?.username ? `@${ctx.from.username}` : "-";
  const note = [
    `Telegram ID: ${ctx.from?.id || "-"}`,
    `Username: ${username}`,
    `Language: ${ctx.from?.language_code || "-"}`,
  ].join("\\n");

  return {
    phoneNumber,
    firstName,
    extra: {
      vcard: [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${escapeVCardValue(firstName)}`,
        `TEL;TYPE=CELL:${escapeVCardValue(phoneNumber)}`,
        `NOTE:${escapeVCardValue(note)}`,
        "END:VCARD",
      ].join("\n"),
    },
  };
}

bot.action(ACTIONS.OPEN_LANG_MENU, async (ctx) => {
  await removeInlineKeyboard(ctx);
  initSession(ctx);
  return sendChangeLangMenu(ctx);
});

bot.action(ACTIONS.START_FLOW, async (ctx) => {
  await removeInlineKeyboard(ctx);
  initSession(ctx);
  return startFlow(ctx);
});

bot.action(ACTIONS.SKIP_OPTIONAL, async (ctx) => {
  initSession(ctx);

  if (!hasActiveFlow(ctx)) {
    return handleSessionLost(ctx);
  }

  const step = steps[ctx.session.stepIndex];
  if (!step || !step.optional) {
    await ctx.answerCbQuery();
    return;
  }

  ctx.session.form[step.key] = "";
  await ctx.answerCbQuery();
  return goToNextStep(ctx);
});

bot.action(ACTIONS.EDIT_KEEP, async (ctx) => {
  initSession(ctx);
  if (!hasActiveFlow(ctx)) {
    return handleSessionLost(ctx);
  }
  const step = steps[ctx.session.stepIndex];
  if (!step || !ctx.session.isEditMode) return;
  await goToNextStep(ctx);
});

bot.action(ACTIONS.SUMMARY_RESET, async (ctx) => {
  initSession(ctx);
  if (!hasActiveFlow(ctx)) {
    return handleSessionLost(ctx);
  }
  await removeInlineKeyboard(ctx);
  ctx.session.form = {};
  ctx.session.stepIndex = null;
  await ctx.answerCbQuery();
  await ctx.reply(getLocalizedText(ctx.session.lang, "summary_reset_done"));
  return sendMainMenu(ctx);
});

bot.action(ACTIONS.SUMMARY_SEND, async (ctx) => {
  initSession(ctx);

  if (!hasActiveFlow(ctx)) {
    return handleSessionLost(ctx);
  }
  await removeInlineKeyboard(ctx);
  const summary = createRequestMsg(ctx);

  const extraOptions = {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };

  try {
    await ctx.telegram.sendMessage(CHAT_ID, summary, extraOptions);
    const contact = createClientContact(ctx);

    if (contact) {
      await ctx.telegram
        .sendContact(
          CHAT_ID,
          contact.phoneNumber,
          contact.firstName,
          contact.extra,
        )
        .catch((error) => {
          console.error("CONTACT SENDING ERROR: ", error);
        });
    }

    await ctx.reply(getLocalizedText(ctx.session.lang, "summary_sent"));
    return sendMainMenu(ctx);
  } catch (error) {
    console.error("ERROR: ", error);
    await ctx.reply(
      getLocalizedText(ctx.session.lang, "request_sending_error"),
    );
    return sendMainMenu(ctx);
  }
});

bot.action(ACTIONS.SUMMARY_EDIT, async (ctx) => {
  initSession(ctx);
  if (!hasActiveFlow(ctx)) {
    return handleSessionLost(ctx);
  }
  ctx.session.isEditMode = true;
  await removeInlineKeyboard(ctx);
  ctx.session.stepIndex = 0;
  return showCurrentQuestion(ctx);
});

bot.action(/^LANG_(pl|en|uk|ru)$/, async (ctx) => {
  await removeInlineKeyboard(ctx);
  initSession(ctx);

  const newLang = ctx.match[1];
  ctx.session.lang = newLang;

  await ctx.answerCbQuery(); // убирает "часики"
  await ctx.reply(getLocalizedText(newLang, "lang_saved"));

  return sendMainMenu(ctx);
});

bot.command("chatid", (ctx) => {
  ctx.reply(`chat_id: ${ctx.chat.id}`);
});

bot.start((ctx) => {
  initSession(ctx);
  if (!ctx.session.lang) ctx.session.lang = detectLang(ctx);
  if (ctx.chat.type !== "private") {
    return ctx.reply(
      getLocalizedText(ctx.session.lang, "private_chat_message"),
      Markup.inlineKeyboard([
        Markup.button.url(
          getLocalizedText(ctx.session.lang, "private_chat_btn"),
          BOT_URL,
        ),
      ]),
    );
  }

  return sendMainMenu(ctx);
});

bot.on(message("text"), async (ctx) => {
  initSession(ctx);

  if (!hasActiveFlow(ctx)) {
    return handleSessionLost(ctx);
  }

  return handleInput(ctx, ctx.message.text);
});

bot.on(message("contact"), async (ctx) => {
  initSession(ctx);

  if (!hasActiveFlow(ctx)) {
    return handleSessionLost(ctx);
  }

  const step = steps[ctx.session.stepIndex];
  if (!step) return;

  if (step.key !== "phone") return;

  await ctx.reply(
    getLocalizedText(ctx.session.lang, "contact_received"),
    Markup.removeKeyboard(),
  );
  return handleInput(ctx, ctx.message.contact.phone_number, {
    fromContact: true,
    keyboardRemoved: true,
  });
}
);
bot.catch((err) => {
  console.error("BOT ERROR: ", err);
});
module.exports = bot;
