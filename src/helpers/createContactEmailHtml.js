const createContactEmailHtml = (data) => {
  return `
    <div style="
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      padding: 24px;
      height: 100vh;
    ">
      <div style="
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        padding: 24px;
        border-radius: 8px;
      ">
        <h2 style="margin-top: 0;">
          Новая заявка с сайта
        </h2>

        <p>
          <strong>Имя:</strong><br />
          ${data.fullName}
        </p>

        <p>
          <strong>Телефон:</strong><br />
          <a href="tel:${data.phone}">
            ${data.phone}
          </a>
        </p>

        <p>
          <strong>VIN:</strong><br />
          ${data.vin}
        </p>

        <p>
          <strong>Сообщение:</strong>
        </p>

        <div style="
          background: #f7f7f7;
          padding: 16px;
          border-radius: 6px;
          white-space: pre-wrap;
        ">
          ${data.message}
        </div>
      </div>
    </div>
  `;
};

module.exports = { createContactEmailHtml };
