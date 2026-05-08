jest.mock("../config/steps", () => [
  { key: "name" },
  { key: "phone" },
]);

jest.mock("../helpers/menu", () => ({
  showSummaryMenu: jest.fn(),
  renderOptional: jest.fn(),
  renderKeepButton: jest.fn(),
  renderContactButton: jest.fn(() => "CONTACT_BUTTON"),
  sendMainMenu: jest.fn(() => "MAIN_MENU"),
}));

jest.mock("../helpers/helpers", () => ({
  format: jest.fn((text) => text),
  initSession: jest.fn((ctx) => {
    if (!ctx.session) ctx.session = {};
    if (!Number.isInteger(ctx.session.stepIndex)) ctx.session.stepIndex = null;
    if (!ctx.session.form) ctx.session.form = {};
  }),
}));

jest.mock("../i18n", () => ({
  getLocalizedText: jest.fn((lang, key) => key),
}));

const {
  hasActiveFlow,
  handleSessionLost,
  startFlow,
  showCurrentQuestion,
  goToNextStep,
  handleInput,
} = require("./flow");

describe("flow engine", () => {
  test("hasActiveFlow handles indexes", () => {
    expect(hasActiveFlow({ session: { stepIndex: 0 } })).toBe(true);
    expect(hasActiveFlow({ session: { stepIndex: 1 } })).toBe(true);
    expect(hasActiveFlow({ session: { stepIndex: 2 } })).toBe(true); // steps.length
    expect(hasActiveFlow({ session: { stepIndex: 3 } })).toBe(false);
    expect(hasActiveFlow({ session: { stepIndex: null } })).toBe(false);
  });

  test("handleSessionLost resets and sends menu", async () => {
    const ctx = {
      session: { stepIndex: 1, form: { name: "x" }, lang: "en" },
      callbackQuery: true,
      answerCbQuery: jest.fn().mockResolvedValue(true),
      reply: jest.fn().mockResolvedValue(true),
    };

    await handleSessionLost(ctx);

    expect(ctx.session.stepIndex).toBe(null);
    expect(ctx.session.form).toEqual({});
    expect(ctx.session.isEditMode).toBe(false);
    expect(ctx.answerCbQuery).toHaveBeenCalled();
    expect(ctx.reply).toHaveBeenCalled();
  });

  test("startFlow and handleInput goes through steps", async () => {
    const ctx = {
      session: {},
      reply: jest.fn().mockResolvedValue(true),
    };

    startFlow(ctx);
    expect(ctx.session.stepIndex).toBe(0);

    await handleInput(ctx, "Hello");
    expect(ctx.session.form.name).toBe("Hello");
    expect(ctx.session.stepIndex).toBe(1);
  });
});
