import { env } from "@config/env.config";
import { logger } from "@shared/services/logger.service";

export type TelegramResult = { success: boolean; error?: string };

/**
 * Send message via Telegram Bot API.
 * Returns { success: false } when token is missing or send fails (graceful, no throw).
 */
export async function sendTelegramMessage(chatId: string, message: string): Promise<TelegramResult> {
  const token = env.TG_BOT_TOKEN;

  if (!token) {
    logger.warn("Telegram bot not configured (TG_BOT_TOKEN missing). Skipping Telegram.");
    return { success: false, error: "Telegram not configured" };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; description?: string };
    const ok = res.ok && data?.ok === true;

    if (!ok) {
      const errMsg = data?.description ?? `Telegram API error: ${res.status}`;
      logger.warn({ chatId, status: res.status, response: data }, "Telegram send failed");
      return { success: false, error: errMsg };
    }

    logger.info({ chatId }, "Message sent successfully via Telegram");
    return { success: true };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error({ chatId, error: errMsg }, "Telegram request failed");
    return { success: false, error: errMsg };
  }
}

export const tgBotService = {
  sendTelegramMessage,
};
