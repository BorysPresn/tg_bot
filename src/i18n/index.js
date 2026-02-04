const pl = require("./dictonaries/pl");
const en = require("./dictonaries/en");
const ua = require("./dictonaries/ua");
const ru = require("./dictonaries/ru");

const dict = { pl, en, ua, ru };

function getLocalizedText(lang, key) {
  return dict[lang]?.[key] || dict.pl[key] || key;
}

module.exports = { getLocalizedText };
