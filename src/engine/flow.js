const { Markup } = require("telegraf");
const steps = require("../config/steps");
const { format, initSession } = require("../helpers/helpers");
const {
  showSummaryMenu,
  renderOptional,
  renderKeepButton,
  sendMainMenu,
  renderContactButton,
} = require("../helpers/menu");
const { getLocalizedText } = require("../i18n");

function startFlow(ctx) {
  ctx.session.stepIndex = 0;
  ctx.session.form = {};

  showCurrentQuestion(ctx);
}

function showCurrentQuestion(ctx) {
  const step = steps[ctx.session.stepIndex];
  if (!step) return;
  const msg = format(
    getLocalizedText(ctx.session.lang, step.questionKey),
    step.meta,
  );

  if (step.key === "phone") {
    const contactButton = renderContactButton(ctx);
    return ctx.reply(
      msg,
      Markup.keyboard([[contactButton]]).oneTime().resize(),
    );
  }

  if (step.optional && !ctx.session.isEditMode) {
    return ctx.reply(msg, renderOptional(ctx));
  }

  if (ctx.session.isEditMode) {
    const value = ctx.session.form[step.key];
    const text = msg + `\n${value}`;
    return ctx.reply(text, renderKeepButton(ctx));
  }
  ctx.reply(msg);
}

async function goToNextStep(ctx) {
  ctx.session.stepIndex++;
  const step = steps[ctx.session.stepIndex];

  if (!step) {
    ctx.session.isEditMode = false;
    return showSummaryMenu(ctx);
  }

  if (ctx.updateType === "callback_query") {
    await ctx.answerCbQuery().catch(() => { });
    await ctx.editMessageReplyMarkup(undefined).catch(() => { });
  }

  await showCurrentQuestion(ctx);
}

function handleInput(ctx, text, options = {}) {
  const step = steps[ctx.session.stepIndex];
  if (!step) return;

  const raw = text || "";
  let preparedRaw = raw;

  if (step.key === "phone" && options.fromContact) {
    let digits = raw.replace(/\D/g, "");
    if (digits.length > 9 && digits.startsWith("48")) {
      digits = digits.slice(2);
    }
    preparedRaw = digits;
  }
  const isValid = step.validate ? step.validate(preparedRaw) : true;

  if (!isValid) {
    const msg = format(
      getLocalizedText(ctx.session.lang, step.errorKey),
      step.meta,
    );
    return ctx.reply(msg);
  }
  let value = step.normalize ? step.normalize(preparedRaw) : raw;

  if (step.key === "phone" && options.fromContact) {
    value = `+48 ${value}`;
  }

  ctx.session.form[step.key] = value;
  goToNextStep(ctx);
}
function hasActiveFlow(ctx) {
  const i = ctx.session.stepIndex;

  if (Number.isInteger(i) && i >= 0 && !!steps[i]) return true;
  //if showing summary
  if (i === steps.length) return true;

  return false;
}
async function handleSessionLost(ctx) {
  initSession(ctx);
  ctx.session.stepIndex = null;
  ctx.session.form = {};
  ctx.session.isEditMode = false;

  if (ctx.callbackQuery) {
    await ctx.answerCbQuery();
  }
  await ctx.reply(getLocalizedText(ctx.session.lang, "session_lost"));
  return sendMainMenu(ctx);
}
module.exports = {
  startFlow,
  handleInput,
  showCurrentQuestion,
  goToNextStep,
  hasActiveFlow,
  handleSessionLost,
};
