import { config } from "dotenv";
import { validateEnv, type EnvSchema } from "@shared/schemas/env.schema";

// Load environment variables from .env file
config();

// Validate and parse environment variables
const validatedEnv = validateEnv();

export const env: EnvSchema = validatedEnv;

// Helper to check if we're in development
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
