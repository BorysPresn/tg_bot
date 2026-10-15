const { escapeHtml } = require("./helpers");

const createCallbackEmailHtml = (data) => {
  return `
    <div style="
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      padding: 24px;
    ">
      <div style="
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        padding: 24px;
        border-radius: 8px;
      ">
        <h2 style="margin-top: 0;">
          Новая заявка с Promo сайта
        </h2>

        <p>
          <strong>Имя:</strong><br />
          ${escapeHtml(data.fullName)}
        </p>

        <p>
          <strong>Телефон:</strong><br />
          <a href="tel:${data.phone}">
            ${data.phone}
          </a>
        </p>
      </div>
    </div>
  `;
};

module.exports = { createCallbackEmailHtml };
