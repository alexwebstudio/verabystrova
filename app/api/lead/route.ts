import { NextResponse } from "next/server";
import { getTelegramCreds } from "@/config/telegram";

export const runtime = "nodejs";

function esc(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, 1500);
}

export async function POST(req: Request) {
  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const name = (data.name || "").trim();
  const phone = (data.phone || "").trim();

  if (name.length < 2 || phone.replace(/\D/g, "").length < 7) {
    return NextResponse.json(
      { ok: false, error: "Проверьте имя и телефон" },
      { status: 422 }
    );
  }

  const { token, chatId } = getTelegramCreds();
  if (!token || token.startsWith("ВСТАВЬ") || !chatId || chatId.startsWith("ВСТАВЬ")) {
    // Токен ещё не настроен — не роняем сайт, но честно говорим об этом в логах
    console.warn("[lead] Telegram не настроен (config/telegram.ts). Заявка:", {
      name,
      phone,
    });
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 }
    );
  }

  const text =
    `<b>🎉 Новая заявка с сайта (квиз)</b>\n\n` +
    `<b>Имя:</b> ${esc(name)}\n` +
    `<b>Телефон:</b> ${esc(phone)}\n` +
    (data.type ? `<b>Тип события:</b> ${esc(data.type)}\n` : "") +
    (data.guests ? `<b>Гостей:</b> ${esc(data.guests)}\n` : "") +
    (data.date ? `<b>Дата события:</b> ${esc(data.date)}\n` : "") +
    (data.contact ? `<b>Удобная связь:</b> ${esc(data.contact)}\n` : "") +
    (data.comment ? `<b>Комментарий:</b> ${esc(data.comment)}\n` : "") +
    `\n<i>${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Almaty" })}</i>`;

  try {
    const tg = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );

    if (!tg.ok) {
      const body = await tg.text();
      console.error("[lead] Telegram error:", body);
      return NextResponse.json({ ok: false, error: "telegram_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[lead] fetch failed:", e);
    return NextResponse.json({ ok: false, error: "network" }, { status: 502 });
  }
}
