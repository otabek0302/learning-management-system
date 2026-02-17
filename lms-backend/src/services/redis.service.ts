import { Redis as UpstashRedis } from "@upstash/redis";

import { redisConfig } from "@config/redis.config";
import { logger } from "@shared/services/logger.service";

const client = new UpstashRedis({ ...redisConfig });

/** Unwrap Upstash response: handles { result } REST wrapper and base64 */
function unwrap<T>(raw: T): string | null {
  if (raw == null) return null;
  let value: unknown = raw;
  if (typeof raw === "object" && raw !== null && "result" in raw) value = (raw as { result: unknown }).result;
  if (typeof value === "string") return value;
  if (value != null) return String(value);
  return null;
}

/** Get and parse JSON. Handles Upstash format and base64 fallback. */
async function getJson<T>(key: string): Promise<T | null> {
  const raw = await client.get(key);
  const str = unwrap(raw);
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    try {
      return JSON.parse(Buffer.from(str, "base64").toString("utf8")) as T;
    } catch {
      return null;
    }
  }
}

/** Get plain string value. Handles Upstash { result } wrapper. */
async function getString(key: string): Promise<string | null> {
  const raw = await client.get(key);
  return unwrap(raw);
}

/** Check if key has a value (handles Upstash format) */
async function hasKey(key: string): Promise<boolean> {
  const val = await getString(key);
  return val != null && val !== "";
}

const redis = Object.assign(client, { getJson, getString, hasKey });

const connectRedis = async (): Promise<void> => {
  logger.info("Redis connected.");
};

const disconnectRedis = async (): Promise<void> => {
  logger.info("Redis disconnected.");
};

export { redis, connectRedis, disconnectRedis };
