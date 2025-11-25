import { env } from "../config/env";
import { Redis as UpstashRedis } from "@upstash/redis";
import { ExternalServiceError } from "../shared/errors/external-service.error";

export class Redis {
  private static instance: Redis;
  private client: UpstashRedis;

  private constructor() {
    this.client = new UpstashRedis({
      url: env.REDIS_REST_URL,
      token: env.REDIS_REST_TOKEN,
    });
  }

  public static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }
    return Redis.instance;
  }

  /** Upstash uses HTTP → connect() is optional */
  public async connect(): Promise<void> {
    try {
      await this.client.ping();
      console.log("[Redis] Upstash connection OK");
    } catch (error: any) {
      console.error("[Redis] Connection error:", error);
      throw new ExternalServiceError("Redis", "Failed to connect", { error });
    }
  }

  /** Disconnect from Redis */
  public async disconnect(): Promise<void> {
    console.log("[Redis] Redis disconnected");
  }

  public getClient(): UpstashRedis {
    return this.client;
  }
}

// Singleton exports
export const redis = Redis.getInstance();
export const redisClient = redis.getClient();