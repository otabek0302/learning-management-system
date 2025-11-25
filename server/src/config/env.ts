import * as dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().min(1, "PORT must be a number").default(8000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  ORIGIN: z.string().default("http://localhost:3000").transform((val) => {
    if (!val || val.trim() === "") {
      return "http://localhost:3000";
    }
    return val.split(",").map((item) => item.trim()).filter(Boolean);
  }).pipe(z.array(z.string())),

  DB_URL: z.string().min(0, "DB_URL must be a string"),
  DB_USER: z.string().min(1, "DB_USER must be a string"),
  DB_PASS: z.string().min(1, "DB_PASS must be a string"),

  REDIS_REST_URL: z.string().min(1, "REDIS_REST_URL must be a string"),
  REDIS_REST_TOKEN: z.string().min(1, "REDIS_REST_TOKEN must be a string"),

  ACTIVATION_TOKEN_SECRET: z.string().min(1, "ACTIVATION_TOKEN_SECRET must be a string"),

  ACCESS_TOKEN: z.string().min(1, "ACCESS_TOKEN must be a string"),
  REFRESH_TOKEN: z.string().min(1, "REFRESH_TOKEN must be a string"),
  FORGOT_PASSWORD_TOKEN_SECRET: z.string().min(1, "FORGOT_PASSWORD_TOKEN_SECRET must be a string"),

  ACCESS_TOKEN_EXPIRATION: z.coerce
    .number()
    .min(0, "ACCESS_TOKEN_EXPIRATION must be a number")
    .default(15 * 60 * 1000), // 15 minutes
  REFRESH_TOKEN_EXPIRATION: z.coerce
    .number()
    .min(0, "REFRESH_TOKEN_EXPIRATION must be a number")
    .default(7 * 24 * 60 * 60 * 1000), // 7 days
  FORGOT_PASSWORD_TOKEN_EXPIRATION: z.coerce
    .number()
    .min(0, "FORGOT_PASSWORD_TOKEN_EXPIRATION must be a number")
    .default(5 * 60 * 1000), // 5 minutes

  SMTP_HOST: z.string().min(1, "SMTP_HOST must be a string"),
  SMTP_PORT: z.coerce.number().min(1, "SMTP_PORT must be a number").default(465), // 465
  SMTP_SERVICE: z.string().min(1, "SMTP_SERVICE must be a string"), // gmail
  SMTP_MAIL: z.string().min(1, "SMTP_MAIL must be a string"),
  SMTP_PASSWORD: z.string().min(1, "SMTP_PASSWORD must be a string"),

  CLOUD_NAME: z.string().min(1, "CLOUD_NAME must be a string"),
  CLOUD_API_KEY: z.string().min(1, "CLOUD_API_KEY must be a string"),
  CLOUD_SECRET_KEY: z.string().min(1, "CLOUD_SECRET_KEY must be a string"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Environment validation failed:");
  parsed.error.issues.forEach((issue: any) => console.error(`  - ${issue.path.join(".")}: ${issue.message}`));
  process.exit(1);
}

export const env = parsed.data as Env;
export type Env = z.infer<typeof envSchema>;
