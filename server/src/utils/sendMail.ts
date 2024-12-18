import { Transporter } from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_SERVICE, SMTP_MAIL, SMTP_PASSWORD } from "../config/config"

import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const { email, subject, template, data } = options;

  // Validate necessary configuration
  if (!SMTP_HOST || !SMTP_MAIL || !SMTP_PASSWORD) {
    throw new Error("Email configuration is not set properly in environment variables.");
  }

  // Create a transporter
  const transporter: Transporter = nodemailer.createTransport({
    host: SMTP_HOST || 'smtp.gmail.com',
    port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : 587,
    service: SMTP_SERVICE || undefined,
    auth: {
      user: SMTP_MAIL,
      pass: SMTP_PASSWORD,
    },
    secure: false,
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    const emailTemplatePath = path.join(__dirname, '../mails', template);
    const html: string = await ejs.renderFile(emailTemplatePath, data);

    await transporter.sendMail({
      from: SMTP_MAIL,
      to: email,
      subject,
      html
    });
    console.log(`Email sent to ${email} with subject: ${subject}`);
  } catch (error: any) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

export default sendMail;