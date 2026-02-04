const {
  all,
  onlyLetters,
  minLength,
  normalizePhone,
  normalizeVin,
} = require("../helpers/validators");
const { LIMITS } = require("./constants");

module.exports = [
  {
    key: "name",
    questionKey: "name_question",
    errorKey: "name_error",
    meta: {
      min: LIMITS.NAME_MIN
    },
    validate: all(minLength(LIMITS.NAME_MIN), onlyLetters),
  },
  {
    key: "phone",
    questionKey: "phone_question",
    errorKey: "phone_error",
    meta: {
      min: LIMITS.PHONE_MIN
    },
    normalize: normalizePhone,
    validate: minLength(LIMITS.PHONE_MIN),
  },
  {
    key: "car_name",
    questionKey: "car_name_question",
    errorKey: "car_name_error",
    meta: {
      min: LIMITS.CAR_MIN
    },
    validate: minLength(LIMITS.CAR_MIN),
  },
  {
    key: "engine",
    questionKey: "engine_question",
    errorKey: "engine_error",
    meta: {
      min: LIMITS.ENGINE_MIN
    },
    validate: minLength(LIMITS.ENGINE_MIN),
  },
  {
    key: "vin",
    questionKey: "vin_question",
    errorKey: "vin_error",
    meta: {
      min: LIMITS.VIN_MIN
    },
    optional: true,
    normalize: normalizeVin,
    validate: minLength(LIMITS.VIN_MIN),
  },
  {
    key: "problem",
    questionKey: "problem_question",
    errorKey: "problem_error",
    meta: {
      min: LIMITS.PROBLEM_MIN
    },
    validate: minLength(LIMITS.PROBLEM_MIN),
  },
];
