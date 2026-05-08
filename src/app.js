const bot = require("./bot");
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const contactRoute = require("./api/contact.routes");
const rateLimit = require("express-rate-limit");

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("S.O.M. bot API is running");
});

const contactFormLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10min
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api/contact", contactFormLimiter, contactRoute(bot));

process.on("uncaughtException", (err) => {
  console.error("uncaughtException: ", err);
});

bot.launch();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  console.log("Bot is running...");
});

// корректная остановка
process.once("SIGINT", () => {
  bot.stop("SIGINT");
  process.exit(0);
});
process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
  process.exit(0);
});
