const { ACTIONS } = require("./constants");

const main = {
  textKey: "main_menu_text",
  colls: 1,
  buttons: [
    {
      type: "inline",
      textKey: "send_request_btn",
      action: ACTIONS.START_FLOW,
    },
    {
      type: "inline",
      textKey: "change_lang_btn",
      action: ACTIONS.OPEN_LANG_MENU,
    },
  ],
};
const changeLanguage = {
  textKey: "change_lang_btn",
  colls: 2,
  buttons: [
    {
      type: "inline",
      textKey: "lang_uk",
      value: "uk",
    },
    {
      type: "inline",
      textKey: "lang_pl",
      value: "pl",
    },
    {
      type: "inline",
      textKey: "lang_en",
      value: "en",
    },
    {
      type: "inline",
      textKey: "lang_ru",
      value: "ru",
    },
  ],
};
const summary = {
  textKey: "summary_title",
  colls: 3,
  buttons: [
    {
      type: "inline",
      textKey: "summary_send_btn",
      action: ACTIONS.SUMMARY_SEND,
    },
    {
      type: "inline",
      textKey: "summary_edit_btn",
      action: ACTIONS.SUMMARY_EDIT,
    },
    {
      type: "inline",
      textKey: "summary_reset_btn",
      action: ACTIONS.SUMMARY_RESET,
    },
  ],
};
const optional = {
  colls: 1,
  buttons: [
    {
      type: "inline",
      textKey: "skip_btn",
      action: ACTIONS.SKIP_OPTIONAL,
    },
  ],
};
const keep = {
  colls: 1,
  buttons: [
    {
      type: "inline",
      textKey: "keep_btn",
      action: ACTIONS.EDIT_KEEP,
    },
  ],
};

module.exports = { main, changeLanguage, summary, optional, keep };
