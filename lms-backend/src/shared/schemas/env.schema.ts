import { z } from "zod";
import { ErrorHandler } from "@middlewares/error.handler";

const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().min(1, "PORT must be a number").default(8000),

  // Logging
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),

  // Database (optional for now, but ready for future use)
  DATABASE_URL: z.string().min(1, "DATABASE_URL must be a string"),
  DATABASE_USER: z.string().min(1, "DATABASE_USER must be a string"),
  DATABASE_PASSWORD: z.string().min(1, "DATABASE_PASSWORD must be a string"),

  REDIS_REST_URL: z.string().min(1, "REDIS_REST_URL must be a string"),
  REDIS_REST_TOKEN: z.string().min(1, "REDIS_REST_TOKEN must be a string"),

  // JWT (optional)
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.coerce.number().min(1, "JWT_EXPIRES_IN must be a number").default(3 * 60 * 60), // 3 hours in seconds
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.coerce.number().min(1, "JWT_REFRESH_EXPIRES_IN must be a number").default(7 * 24 * 60 * 60), // 7 days in seconds

  // API Keys (optional)
  API_PREFIX: z.string().default("/api/v1"),

  // Email (optional - either SMTP_HOST or SMTP_SERVICE required)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().min(1, "SMTP_PORT must be a number").optional(),
  SMTP_SERVICE: z.string().optional(), // Service name (gmail, outlook, etc.)
  SMTP_MAIL: z.string().optional(), // Email address (user)
  SMTP_PASSWORD: z.string().optional(), // Email password

  // CORS
  CORS_ORIGIN: z.string().optional().transform((val) => !val || val.trim() === "" ? [] : val.split(",").map((item) => item.trim()).filter(Boolean)).pipe(z.array(z.string())),
  CORS_CREDENTIALS: z.string().default("true").transform((val) => val === "true" || val === "1"),

  // Rate Limiting (per IP; increase if client makes many requests e.g. categories + products + cart + auth)
  RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1, "RATE_LIMIT_WINDOW_MS must be a number").default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1, "RATE_LIMIT_MAX_REQUESTS must be a number").default(300),

  // Cloudinary (optional)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Frontend URL
  FRONTEND_URL: z.string().optional(),

  // Uzum Bank (optional – for Uzum webhook; used internally by payment-service)
  UZUM_SERVICE_ID: z.string().optional(),
  UZUM_WEBHOOK_LOGIN: z.string().optional(),
  UZUM_WEBHOOK_PASSWORD: z.string().optional(),

  // DevSMS (devsms.uz - SMS OTP)
  DEVSMS_URL: z.string().url().optional(),
  DEVSMS_TOKEN: z.string().optional(),
  DEVSMS_FROM: z.string().optional(),

  // Telegram (fallback for SMS OTP)
  TG_BOT_TOKEN: z.string().optional(),
  TG_BOT_USERNAME: z.string().optional(),
  TG_OTP_CHAT_ID: z.string().optional(),
});

export type EnvSchema = z.infer<typeof envSchema>;

export const validateEnv = (): EnvSchema => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((err) => ({ path: err.path.join("."), message: err.message }));
      console.error("Invalid environment variables:\n", JSON.stringify(issues, null, 2));
      throw new ErrorHandler("Invalid environment variables", 500, { error: issues });
    }
    console.error("Invalid environment variables:", error);
    throw new ErrorHandler("Invalid environment variables", 500, { error });
  }
};
