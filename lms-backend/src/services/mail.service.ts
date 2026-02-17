import nodemailer from "nodemailer";
import path from "path";
import fs from "fs/promises";

import { mailConfig } from "@config/mail.config";
import { env } from "@config/env.config";
import { logger } from "@shared/services/logger.service";

const TEMPLATES_DIR = path.join(process.cwd(), "src/shared/templates/mails");

export interface SendMailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  context?: Record<string, string>;
}

const transporter = mailConfig.service
  ? nodemailer.createTransport({ service: mailConfig.service, auth: mailConfig.auth })
  : nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: mailConfig.auth,
    });

async function loadTemplate(templateName: string, context: Record<string, string> = {}): Promise<string> {
  const filePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
  try {
    let content = await fs.readFile(filePath, "utf-8");
    for (const [key, value] of Object.entries(context)) {
      content = content.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    return content;
  } catch (error) {
    logger.error({ error, templateName }, "Failed to load email template");
    throw new Error(`Email template not found: ${templateName}`);
  }
}

export async function sendMail(options: SendMailOptions): Promise<void> {
  const { to, subject, html, text, template, context = {} } = options;

  let htmlContent = html;
  if (template) {
    htmlContent = await loadTemplate(template, context);
  }

  if (!htmlContent && !text) {
    throw new Error("Either html, text, or template must be provided");
  }

  await transporter.sendMail({
    from: mailConfig.from,
    to,
    subject,
    html: htmlContent,
    text: text ?? (htmlContent ? htmlContent.replace(/<[^>]*>/g, "") : undefined),
  });
}

export async function sendForgotPasswordMail(to: string, token: string, name?: string): Promise<void> {
  const resetUrl = env.FRONTEND_URL ? `${env.FRONTEND_URL}/reset-password?token=${token}` : `#token=${token}`;
  await sendMail({
    to,
    subject: "Reset your password",
    template: "forgot-password",
    context: {
      name: name ?? "User",
      reset_url: resetUrl,
      token,
    },
  });
}

export async function sendOtpMail(to: string, code: string, name?: string): Promise<void> {
  await sendMail({
    to,
    subject: "Your verification code",
    template: "otp",
    context: {
      name: name ?? "User",
      code,
    },
  });
}

export async function sendVerificationMail(to: string, token: string, name?: string): Promise<void> {
  const verifyUrl = env.FRONTEND_URL ? `${env.FRONTEND_URL}/verify-email?token=${token}` : `#token=${token}`;
  await sendMail({
    to,
    subject: "Verify your email",
    template: "verify-email",
    context: {
      name: name ?? "User",
      verify_url: verifyUrl,
      token,
    },
  });
}

export const mailService = {
  sendMail,
  sendOtpMail,
  sendForgotPasswordMail,
  sendVerificationMail,
};
