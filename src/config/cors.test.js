const { once } = require("node:events");
const express = require("express");
const cors = require("cors");
const createCorsOptions = require("./cors");

const originalOrigins = process.env.CLIENT_ORIGINS;
const originalOrigin = process.env.CLIENT_ORIGIN;

beforeEach(() => {
  delete process.env.CLIENT_ORIGINS;
  delete process.env.CLIENT_ORIGIN;
});

afterEach(() => {
  if (originalOrigins === undefined) delete process.env.CLIENT_ORIGINS;
  else process.env.CLIENT_ORIGINS = originalOrigins;

  if (originalOrigin === undefined) delete process.env.CLIENT_ORIGIN;
  else process.env.CLIENT_ORIGIN = originalOrigin;
});

test("defaults to the local frontend", () => {
  expect(createCorsOptions().origin).toEqual(["http://localhost:5173"]);
});

test("preserves the existing CLIENT_ORIGIN configuration", () => {
  process.env.CLIENT_ORIGIN = "https://auto-som.pl";
  expect(createCorsOptions().origin).toEqual(["https://auto-som.pl"]);
});

test("prefers CLIENT_ORIGINS and ignores empty entries", () => {
  process.env.CLIENT_ORIGIN = "https://old.example";
  process.env.CLIENT_ORIGINS = " https://auto-som.pl, , https://promo.auto-som.pl, ";
  expect(createCorsOptions().origin).toEqual([
    "https://auto-som.pl",
    "https://promo.auto-som.pl",
  ]);
});

test("allows preflight only for explicitly configured origins", async () => {
  const origins = ["https://auto-som.pl", "https://promo.auto-som.pl"];
  process.env.CLIENT_ORIGINS = origins.join(",");
  const app = express();
  app.use(cors(createCorsOptions()));
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");

  try {
    const { port } = server.address();
    for (const origin of [...origins, "https://untrusted.example"]) {
      const response = await fetch(`http://127.0.0.1:${port}/api/callback`, {
        method: "OPTIONS",
        headers: {
          Origin: origin,
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "content-type",
        },
        signal: AbortSignal.timeout(5000),
      });
      expect(response.status).toBe(204);
      expect(response.headers.get("access-control-allow-origin")).toBe(
        origins.includes(origin) ? origin : null,
      );
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
