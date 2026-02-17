import { env } from "@config/env.config";

// Mail variables
if (!env.SMTP_MAIL || !env.SMTP_PASSWORD || (!env.SMTP_HOST && !env.SMTP_SERVICE)) {
  throw new Error("SMTP_MAIL, SMTP_PASSWORD and (SMTP_HOST or SMTP_SERVICE) are required");
}

const mailConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT ?? 587,
  secure: env.SMTP_PORT === 465,
  service: env.SMTP_SERVICE,
  auth: {
    user: env.SMTP_MAIL,
    pass: env.SMTP_PASSWORD,
  },
  from: `LMS <${env.SMTP_MAIL}>`,
};

export { mailConfig };
