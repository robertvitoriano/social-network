import { createClient, RedisClientType } from "redis";
import { AppError } from "../errors/AppError";
import { env } from "src/config/env";

export class Redis {
  private static client: RedisClientType | null = null;
  private static isConnected: boolean = false;

  static getClient(): RedisClientType {
    if (!Redis.client) {
      throw new AppError("Redis client is not initialized", 500);
    }
    return Redis.client;
  }

  static async connect(): Promise<void> {
    if (this.isConnected) return;
    Redis.client = createClient({
      url: env.REDIS_URL,
    });
    Redis.client.on("error", (err) => {
      console.error("Redis error:", err);
    });

    await Redis.client.connect();
    Redis.isConnected = true;
  }
}
