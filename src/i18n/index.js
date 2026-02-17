const pl = require("./dictonaries/pl");
const en = require("./dictonaries/en");
const ua = require("./dictonaries/ua");
const ru = require("./dictonaries/ru");
const { DEFAULT_LANG } = require("../config/constants");

const dict = { pl, en, ua, ru };

function getLocalizedText(lang, key) {
  return dict[lang]?.[key] || dict[DEFAULT_LANG][key] || key;
}

module.exports = { getLocalizedText };
