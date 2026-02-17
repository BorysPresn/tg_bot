# Serwis S.O.M. — Telegram Bot (MVP)

Telegram bot for the **Serwis S.O.M.** car service.
It collects a service request from the client step by step and sends it to the service Telegram group.
Supports 4 languages: **PL (default), RU, UA, EN**.

MVP version: no CRM, no database, no admin panel.

---

## Features (MVP)

* Step-by-step request form:

  1. Name
  2. Phone number
  3. Car make and model
  4. Engine
  5. VIN (optional)
  6. Problem or service description
* Summary screen before submission
* Buttons: **Send / Edit / Cancel**
* Request is sent to the service Telegram group
* Multilingual support:

  * automatic language detection from Telegram settings
  * manual language switch from the main menu
* Session loss protection:

  * if the server restarts or the scenario breaks, the bot shows an error message and returns the user to the main menu

---

## Tech Stack

* Node.js
* Telegraf
* dotenv
* nodemon (development)

---

## Project Structure

Main files:

* `index.js` — entry point
* `src/app.js` — application initialization
* `src/bot.js` — Telegram handlers (commands, buttons, text)
* `src/flow.js` — scenario logic (steps, summary, submission)
* `src/steps.js` — form step configuration
* `src/validators.js` — validators and normalizers
* `src/i18n` — translations (PL, RU, UA, EN)

---

## Installation and Run

1. Install dependencies:

npm install

2. Create a `.env` file in the project root.

Example:

BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
SERVICE_CHAT_ID=-1001234567890
BOT_URL=[https://t.me/your_bot_name](https://t.me/your_bot_name)
DEFAULT_LANG=pl

`SERVICE_CHAT_ID` is the Telegram group ID where requests will be sent.

3. Run in development mode:

npm run dev

4. Run in production:

npm start

---

## Telegram Group Setup

1. Add the bot to the service group.
2. Give it permission to send messages.
3. Get the group `chat_id` (for example, log `ctx.chat.id` once).
4. Put the value into `SERVICE_CHAT_ID` in `.env`.

---

## Languages

Supported languages:

* `pl` — Polish (default)
* `ru` — Russian
* `ua` — Ukrainian
* `en` — English

### Auto-detection

The bot detects the language from the user’s Telegram settings.
If the language is not recognized, `DEFAULT_LANG` is used.

Users can manually change the language from the main menu.

---

## Data Validation

* Phone number is normalized to a consistent format.
* VIN (if provided) is validated for allowed characters and length.
* VIN field is optional and can be skipped.

---

## Session Loss Behavior

If the bot is restarted or the scenario becomes invalid:

* the bot sends a technical error message
* resets the current flow
* returns the user to the main menu

This prevents broken or stuck conversations.

---

## Deployment Options

### Option 1 — Separate hosting (recommended)

* VPS
* Render
* Railway

Advantages:

* more stable
* independent from the website
* easier maintenance

### Option 2 — Client’s server

Possible if the client has their own VPS/server and a system administrator.

---

## Common Issues

**“Cannot find module …” error**
Check that the file exists and the `require` path is correct.

**Form resets after server restart**
This is normal for the MVP without a database: sessions are stored in memory.
If the session is lost, the bot returns the user to the main menu.

---

## License

MVP for Serwis S.O.M.
For internal use by the car service.

---