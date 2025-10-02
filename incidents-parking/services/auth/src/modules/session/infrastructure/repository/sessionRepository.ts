import { SessionPayload } from "../../domain/model";
import { RedisClient } from "../../../../common/db/config/configRedis";

export class SessionRepository {
  private readonly days: number = 7;
  //dias * 24horas * 60 mintuos * 60 sec
  private readonly expireInSeconds: number = this.days * 24 * 60 * 60;
  private redisClient = RedisClient.getInstance();

  public async createOrUpdate({
    userId,
    token,
  }: SessionPayload): Promise<SessionPayload> {
    try {
      await this.redisClient.set(userId, token, "EX", this.expireInSeconds);

      return { userId, token };
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in SessionRepository of createOrUpdate method`
      );
    }
  }

  public async refresh(userId: string): Promise<void> {
    try {
      await this.redisClient.expire(userId, this.expireInSeconds);
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in SessionRepository of refresh method`
      );
    }
  }

  public async findTokenByUserId(userId: string): Promise<string | null> {
    try {
      return await this.redisClient.get(userId);
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in SessionRepository of findTokenByUserId method`
      );
    }
  }

  public async delete(userId: string): Promise<number> {
    try {
      return await this.redisClient.del(userId);
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in SessionRepository of delete method`
      );
    }
  }
}
