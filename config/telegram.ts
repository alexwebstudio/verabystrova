import "server-only";

/**
 * ─────────────────────────────────────────────────────────────
 *  TELEGRAM — заявки с сайта уходят сюда.
 *  Просто впиши свои значения между кавычек. Код менять не нужно.
 * ─────────────────────────────────────────────────────────────
 *
 *  BOT_TOKEN — получаешь у @BotFather при создании бота.
 *  CHAT_ID   — твой личный id (узнать у @userinfobot),
 *              либо id группы/канала, куда бот добавлен админом.
 *
 *  Файл помечен "server-only" — он НИКОГДА не попадёт в браузер,
 *  токен виден только на сервере. Можно спокойно хранить здесь.
 *
 *  (По желанию можно переопределить через переменные окружения
 *   TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID — они имеют приоритет.)
 */

export const telegramConfig = {
  BOT_TOKEN: "ВСТАВЬ_СВОЙ_BOT_TOKEN",
  CHAT_ID: "ВСТАВЬ_СВОЙ_CHAT_ID",
};

export function getTelegramCreds() {
  return {
    token: process.env.TELEGRAM_BOT_TOKEN || telegramConfig.BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID || telegramConfig.CHAT_ID,
  };
}
