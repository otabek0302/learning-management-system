import dotenv from "dotenv";

dotenv.config();

// Safely parse the ORIGINS environment variable, handling it as a JSON array or comma-separated string.
function parseOrigins(originsStr?: string): string[] {
  // Default origins for development
  const defaultOrigins = ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"];
  
  if (!originsStr) {
    return defaultOrigins;
  }

  // Try to parse as JSON array
  try {
    const parsed = JSON.parse(originsStr);
    if (Array.isArray(parsed)) {
      // Filter out invalid origins (must be valid URLs)
      const validOrigins = parsed.filter((origin: string) => {
        if (typeof origin !== 'string') return false;
        // Must be a valid URL starting with http:// or https://
        return origin.startsWith('http://') || origin.startsWith('https://');
      });
      // If we have valid origins, return them; otherwise use defaults
      return validOrigins.length > 0 ? validOrigins : defaultOrigins;
    }
    // Single value - check if valid
    if (typeof parsed === 'string' && (parsed.startsWith('http://') || parsed.startsWith('https://'))) {
      return [parsed];
    }
    return defaultOrigins;
  } catch (error) {
    // If JSON parse fails, try to split by commas.
    const origins = originsStr.split(",").map(o => o.trim()).filter(Boolean);
    // Filter valid origins
    const validOrigins = origins.filter(origin => 
      origin.startsWith('http://') || origin.startsWith('https://')
    );
    return validOrigins.length > 0 ? validOrigins : defaultOrigins;
  }
}

export const PORT = process.env.PORT || "8000";
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