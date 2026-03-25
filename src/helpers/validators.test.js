const {
  all,
  minLength,
  validatePhone,
  onlyLetters,
  normalizePhone,
  normalizeVin,
  validateVin,
} = require("./validators");

describe("validators", () => {
  test("minLength", () => {
    const v = minLength(3);
    expect(v("abc")).toBe(true);
    expect(v("ab")).toBe(false);
    expect(v("  ")).toBe(false);
  });

  test("onlyLetters", () => {
    expect(onlyLetters("John Doe")).toBe(true);
    expect(onlyLetters("Анна")).toBe(true);
    expect(onlyLetters("S0mething")).toBe(false);
    expect(onlyLetters("123")).toBe(false);
  });

  test("validatePhone", () => {
    const v = validatePhone(9);
    expect(v("500600700")).toBe(true);
    expect(v("500 600 700")).toBe(false);
    expect(v("50060070")).toBe(false);
  });

  test("normalizePhone", () => {
    expect(normalizePhone("500600700")).toBe("500 600 700");
    expect(normalizePhone(" 500600700 ")).toBe("500 600 700");
  });

  test("normalizeVin", () => {
    expect(normalizeVin("1hgcm82633a004352")).toBe("1HGCM82633A004352");
  });

  test("validateVin", () => {
    expect(validateVin("1HGCM82633A004352")).toBe(true);
    expect(validateVin("1HGC M8263 3A004352")).toBe(false);
    expect(validateVin("" )).toBe(true);
    expect(validateVin(null)).toBe(true);
  });

  test("all composer", () => {
    const v = all(minLength(2), onlyLetters);
    expect(v("Hi")).toBe(true);
    expect(v("H1")).toBe(false);
    expect(v("h")).toBe(false);
  });
});
