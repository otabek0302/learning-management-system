import { smsConfig } from "@config/sms.config";
import { logger } from "@shared/services/logger.service";

export type DevSmsResult = { success: boolean; error?: string };

/**
 * Normalize phone number for DevSMS: remove + and spaces (e.g. +998901234567 -> 998901234567)
 */
function normalizePhoneForSms(phone: string): string {
  return phone.replace(/^\+|\s/g, "").replace(/\D/g, "").replace(/^8/, "998");
}

/**
 * Send SMS via DevSMS (devsms.uz) API.
 * Returns success/failure. Graceful when not configured.
 */
export async function sendSms(phone: string, message: string): Promise<DevSmsResult> {

  if (!smsConfig.url || !smsConfig.token) {
    logger.warn("DevSMS not configured (DEVSMS_URL or DEVSMS_TOKEN missing). Skipping SMS.");
    return { success: false, error: "DevSMS not configured" };
  }

  const normalizedPhone = normalizePhoneForSms(phone);
  const finalPhone = normalizedPhone.startsWith("998") ? normalizedPhone : `998${normalizedPhone}`;
  const body: Record<string, string> = { phone: finalPhone, message };
  if (smsConfig.from) body.from = smsConfig.from;

  try {
    const url = `${smsConfig.url.replace(/\/$/, "")}/send_sms.php`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${smsConfig.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string; error?: string };
    const ok = res.ok && data?.success !== false;

    if (!ok) {
      const errMsg = data?.message ?? data?.error ?? `DevSMS error: ${res.status}`;
      logger.warn({ phone: finalPhone, status: res.status, response: data }, "DevSMS send failed");
      return { success: false, error: errMsg };
    }

    logger.info({ phone: finalPhone }, "SMS sent successfully via DevSMS");
    return { success: true };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error({ phone: finalPhone, error: errMsg }, "DevSMS request failed");
    return { success: false, error: errMsg };
  }
}

export const smsService = {
  sendSms,
};
