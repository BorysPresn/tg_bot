const express = require("express");
const { sendCallbackEmail } = require("../services/mail.sevices");
const createCallbackRouter = require("./callback.routes");
const { once } = require("node:events");

jest.mock("../services/mail.sevices", () => ({
  sendCallbackEmail: jest.fn(),
}));

const originalChatId = process.env.TELEGRAM_CHAT_ID;

beforeEach(() => {
  jest.clearAllMocks();
  process.env.TELEGRAM_CHAT_ID = "test-chat";
});

afterEach(() => {
  if (originalChatId === undefined) {
    delete process.env.TELEGRAM_CHAT_ID;
  } else {
    process.env.TELEGRAM_CHAT_ID = originalChatId;
  }
});

test("returns 200 when email fails but Telegram succeeds", async () => {
  sendCallbackEmail.mockRejectedValueOnce(new Error("Email unavailable"));

  const bot = {
    telegram: {
      sendMessage: jest.fn().mockResolvedValueOnce({
        message_id: 1,
      }),
    },
  };

  const app = express();

  app.use(express.json());
  app.use("/api/callback", createCallbackRouter(bot));

  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");

  try {
    const { port } = server.address();

    const response = await fetch(`http://127.0.0.1:${port}/api/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: "Borys",
        phone: "+48111222333",
      }),
      signal: AbortSignal.timeout(5000),
    });

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);

    expect(sendCallbackEmail).toHaveBeenCalledTimes(1);
    expect(bot.telegram.sendMessage).toHaveBeenCalledTimes(1);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("returns 200 when Telegram fails but email succeeds", async () => {
  sendCallbackEmail.mockResolvedValueOnce({
    id: "test-email",
  });

  const bot = {
    telegram: {
      sendMessage: jest
        .fn()
        .mockRejectedValueOnce(new Error("Telegram unavailable")),
    },
  };

  const app = express();

  app.use(express.json());
  app.use("/api/callback", createCallbackRouter(bot));

  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");

  try {
    const { port } = server.address();

    const response = await fetch(`http://127.0.0.1:${port}/api/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: "Borys",
        phone: "+48111222333",
      }),
      signal: AbortSignal.timeout(5000),
    });

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);

    expect(sendCallbackEmail).toHaveBeenCalledTimes(1);
    expect(bot.telegram.sendMessage).toHaveBeenCalledTimes(1);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("returns 502 when both delivery channels fail", async () => {
  sendCallbackEmail.mockRejectedValueOnce(new Error("Email unavailable"));

  const bot = {
    telegram: {
      sendMessage: jest
        .fn()
        .mockRejectedValueOnce(new Error("Telegram unavailable")),
    },
  };

  const app = express();

  app.use(express.json());
  app.use("/api/callback", createCallbackRouter(bot));

  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");

  try {
    const { port } = server.address();

    const response = await fetch(`http://127.0.0.1:${port}/api/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: "Borys",
        phone: "+48111222333",
      }),
      signal: AbortSignal.timeout(5000),
    });

    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.ok).toBe(false);

    expect(sendCallbackEmail).toHaveBeenCalledTimes(1);
    expect(bot.telegram.sendMessage).toHaveBeenCalledTimes(1);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
