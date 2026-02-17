const bot = require("./bot");
process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection: ", reason);
});

process.on("uncaughtException", (err) => {
  console.error("uncaughtException: ", err);
});

bot.launch();

console.log("Bot is running...");

// корректная остановка
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
