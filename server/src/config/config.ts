import dotenv from "dotenv";

dotenv.config();

// Safely parse the ORIGINS environment variable, handling it as a JSON array or comma-separated string.
function parseOrigins(originsStr?: string): string[] {
  if (!originsStr) {
    return ["http://localhost:3000", "http://localhost:3001"];
  }

  // Try to parse as JSON array
  try {
    const parsed = JSON.parse(originsStr);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [parsed];
  } catch (error) {
    // If JSON parse fails, try to split by commas.
    return originsStr.split(",").map(o => o.trim()).filter(Boolean);
  }
}

export const PORT = process.env.PORT || "3000";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const ORIGINS = parseOrigins(process.env.ORIGIN);

// Database configuration
export const DATABASE_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/lms";
export const DB_USER = process.env.DB_USER || "";
export const DB_PASS = process.env.DB_PASS || "";

// Cloud configuration (for file uploads, images, etc.)
export const CLOUD_NAME = process.env.CLOUD_NAME || "";
export const CLOUD_API_KEY = process.env.CLOUD_API_KEY || "";
export const CLOUD_SECRET_KEY = process.env.CLOUD_SECRET_KEY || "";

// Redis / Upstash configuration
export const REDIS_REST_URL = process.env.REDIS_REST_URL || "";
export const REDIS_REST_TOKEN = process.env.REDIS_REST_TOKEN || "";

// Activation token
export const ACTIVATION_TOKEN_SECRET = process.env.ACTIVATION_TOKEN_SECRET || "";
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "";
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN || "";

export const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || "";
export const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || "";

// Forgot password token
export const FORGOT_PASSWORD_TOKEN_SECRET = process.env.FORGOT_PASSWORD_TOKEN_SECRET || "";

// SMTP activation email configuration
export const SMTP_HOST = process.env.SMTP_HOST || "";
export const SMTP_PORT = process.env.SMTP_PORT || "";
export const SMTP_SERVICE = process.env.SMTP_SERVICE || "";
export const SMTP_MAIL = process.env.SMTP_MAIL || "";
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";

// VdoCipher API configuration
export const VDOCIPHER_API_SECRET = process.env.VDOCIPHER_API_SECRET || "";