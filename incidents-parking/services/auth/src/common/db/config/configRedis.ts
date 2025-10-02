import dotenvFlow from "dotenv-flow";
import Redis from "ioredis";

dotenvFlow.config({
  silent: true,
});

export class RedisClient {
  private static instance: Redis;

  private static getRedisConfig() {
    return {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      // password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || "0"),
    };
  }

  public static getInstance(): Redis {
    if (!this.instance) {
      this.instance = new Redis(this.getRedisConfig());
    }
    return this.instance;
  }

  public static async test(): Promise<Redis> {
    if (!this.instance) {
      this.getInstance(); // Utiliza getInstance para crear la instancia si aún no existe

      return new Promise((resolve, reject) => {
        this.instance.on("connect", () => {
          console.log("Connected Redis");
        });

        this.instance.on("ready", () => {
          console.log("Redis is ready");
          resolve(this.instance);
        });

        this.instance.on("error", (err) => {
          console.error("Error de conexión a Redis:", err);
          reject(new Error("Error de conexión a Redis"));
        });
      });
    } else {
      return Promise.resolve(this.instance);
    }
  }
}
