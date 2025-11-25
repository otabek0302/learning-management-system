import type { Transporter } from "nodemailer";
import type { EmailOptions } from "../shared/interfaces";

import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

import { env } from "../config/env";
import { ExternalServiceError } from "../shared/errors/external-service.error";
import { ValidationError } from "../shared/errors/validation.error";

/**
 * Email Service Class
 */
export class EmailService {
  private static instance: EmailService;
  private transporter: Transporter | null = null;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /** Initialize email transporter */
  private createTransporter(): Transporter {
    if (!env.SMTP_HOST || !env.SMTP_MAIL || !env.SMTP_PASSWORD) {
      throw new ExternalServiceError("Email Service", "Email configuration is not set properly in environment variables");
    }

    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      service: env.SMTP_SERVICE,
      auth: {
        user: env.SMTP_MAIL,
        pass: env.SMTP_PASSWORD,
      },
      secure: env.SMTP_PORT === 465,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  /** Get or create transporter */
  private getTransporter(): Transporter {
    if (!this.transporter) {
      this.transporter = this.createTransporter();
    }
    return this.transporter;
  }

  /** Render email template */
  private async renderTemplate(template: string, data: Record<string, any>): Promise<string> {
    try {
      const templatePath = path.join(__dirname, "../mails", template);
      return await ejs.renderFile(templatePath, data);
    } catch (error) {
      throw new ExternalServiceError("Email Service", `Failed to render email template: ${template}`, { error });
    }
  }

  /** Send email */
  public async sendMail(options: EmailOptions): Promise<void> {
    try {
      const { email, subject, template, data } = options;

      if (!email || !subject || !template) {
        throw new ValidationError("Email, subject, and template are required");
      }

      const transporter = this.getTransporter();
      const html = await this.renderTemplate(template, data);

      await transporter.sendMail({
        from: env.SMTP_MAIL,
        to: email,
        subject,
        html,
      });

      console.log(`[Email] Sent to ${email} → Subject: ${subject}`);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof ExternalServiceError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new ExternalServiceError("Email Service", `Failed to send email: ${message}`, { error });
    }
  }

  /** Verify email configuration */
  public async verifyConnection(): Promise<boolean> {
    try {
      const transporter = this.getTransporter();
      await transporter.verify();
      console.log("[Email] SMTP connection verified");
      return true;
    } catch (error: unknown) {
      console.error("[Email] SMTP verification failed:", error);
      throw new ExternalServiceError("Email Service", "Failed to verify SMTP connection", { error });
    }
  }
}

// Singleton exports
export const emailService = EmailService.getInstance();

// Backward compatibility - export function directly
export const sendMail = (options: EmailOptions) => emailService.sendMail(options);
export default sendMail;
