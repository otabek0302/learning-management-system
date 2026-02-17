import { env } from "@config/env.config";

// Database variables
if (!env.DATABASE_URL || !env.DATABASE_USER || !env.DATABASE_PASSWORD) {
  throw new Error("DATABASE_URL, DATABASE_USER and DATABASE_PASSWORD are required");
}

const databaseConfig = {
  url: env.DATABASE_URL,
  user: env.DATABASE_USER,
  pass: env.DATABASE_PASSWORD,
};

export { databaseConfig };
