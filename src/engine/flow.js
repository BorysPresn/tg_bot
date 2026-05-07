const { Markup } = require("telegraf");
const steps = require("../config/steps");
const { format, initSession } = require("../helpers/helpers");
const {
  showSummaryMenu,
  renderOptional,
  renderKeepButton,
  sendMainMenu,
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

  if(step.key === "phone") {
    const keyboard = Markup.keyboard([
      Markup.button.contactRequest(getLocalizedText(ctx.session.lang, "send_contact_btn"))  // добавь ключ в i18n
    ]).oneTime().resize();
    return ctx.reply(msg, keyboard);
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

  if (ctx.updateType === "callback_query") {
    await ctx.answerCbQuery().catch(() => {});
    await ctx.editMessageReplyMarkup(undefined).catch(() => {});
  }

  if (!step) {
    ctx.session.isEditMode = false;
    return showSummaryMenu(ctx);
  }
  await showCurrentQuestion(ctx);
}
async function handleInput(ctx, text) {
  const step = steps[ctx.session.stepIndex];
  if (!step) return;

  const raw = text || "";
  const isValid = step.validate ? step.validate(raw) : true;
  if (!isValid) {
    const msg = format(
      getLocalizedText(ctx.session.lang, step.errorKey),
      step.meta,
    );
    return ctx.reply(msg);
  }
  const value = step.normalize ? step.normalize(raw) : raw;

  ctx.session.form[step.key] = value;
  await goToNextStep(ctx);
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
