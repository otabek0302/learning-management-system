import { env } from "@config/env.config";

// Redis variables
if (!env.REDIS_REST_URL || !env.REDIS_REST_TOKEN) {
  throw new Error("REDIS_REST_URL and REDIS_REST_TOKEN are required");
}

const redisConfig = {
  url: env.REDIS_REST_URL,
  token: env.REDIS_REST_TOKEN,
  responseEncoding: false as const,
};

export { redisConfig };
