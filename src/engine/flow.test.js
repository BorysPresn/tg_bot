jest.mock("../config/steps", () => [
  { key: "name", questionKey: "name_question" },
  { key: "phone", questionKey: "phone_question" },
  { key: "car_name", questionKey: "car_name_question" },
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
const menu = require("../helpers/menu");

describe("flow engine", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("hasActiveFlow handles indexes", () => {
    expect(hasActiveFlow({ session: { stepIndex: 0 } })).toBe(true);
    expect(hasActiveFlow({ session: { stepIndex: 1 } })).toBe(true);
    expect(hasActiveFlow({ session: { stepIndex: 3 } })).toBe(true); // steps.length
    expect(hasActiveFlow({ session: { stepIndex: 4 } })).toBe(false);
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

  test("handleInput removes contact keyboard after phone step", async () => {
    const ctx = {
      session: { stepIndex: 1, form: {}, lang: "en" },
      reply: jest.fn().mockResolvedValue(true),
    };

    await handleInput(ctx, "729449643");

    expect(ctx.session.form.phone).toBe("729449643");
    expect(ctx.session.stepIndex).toBe(2);
    expect(ctx.reply).toHaveBeenNthCalledWith(
      1,
      "car_name_question",
      expect.objectContaining({
        reply_markup: expect.objectContaining({ remove_keyboard: true }),
      }),
    );
  });

  test("showCurrentQuestion uses keep button for phone in edit mode", () => {
    menu.renderKeepButton.mockReturnValue("KEEP_BUTTON");
    const ctx = {
      session: {
        stepIndex: 1,
        isEditMode: true,
        form: { phone: "729 449 643" },
        lang: "en",
      },
      reply: jest.fn().mockResolvedValue(true),
    };

    showCurrentQuestion(ctx);

    expect(menu.renderKeepButton).toHaveBeenCalledWith(ctx);
    expect(menu.renderContactButton).not.toHaveBeenCalled();
    expect(ctx.reply).toHaveBeenCalledWith(
      "phone_question\n729 449 643",
      "KEEP_BUTTON",
    );
  });
});
