const validateContactForm = require("./contactFormValidator");

const validContactFormData = {
  fullName: "Jan Kowalski",
  phone: "+48500600700",
  vin: "1HGCM82633A004352",
  message: "Opis problemu",
  consent: true,
};

describe("contactFormValidator", () => {
  test.each([
    "Jan Kowalski",
    "Anna-Maria Nowak",
    "O'Connor",
    "Paweł Żuk",
    "Александр Иванов",
  ])("accepts valid full name: %s", (fullName) => {
    const result = validateContactForm({
      ...validContactFormData,
      fullName,
    });

    expect(result.errors.fullName).toBeUndefined();
  });

  test.each(["123", "Jan!!!", "@@@", "Jan 123"])(
    "rejects invalid full name: %s",
    (fullName) => {
      const result = validateContactForm({
        ...validContactFormData,
        fullName,
      });

      expect(result.errors.fullName).toBe("Invalid full name format");
    },
  );
});
