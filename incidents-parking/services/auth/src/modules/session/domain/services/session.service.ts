import { SessionPayload } from "./../model";
import { SessionRepository } from "../../infrastructure/repository/sessionRepository";
import { AuthTokenService as AuthToken } from "../../../authToken/domain/services/authToken";
import { TokenDto } from "../../../authToken/domain/models/token";
import listCodeErrors from "./../../../../common/utils/listCodeErrors";

export class SessionService {
  constructor(private readonly sessionRepository = new SessionRepository()) {}

  public async createOrUpdate(
    props: SessionPayload
  ): Promise<SessionPayload | null> {
    try {
      return await this.sessionRepository.createOrUpdate(props);
    } catch (error) {
      throw error;
    }
  }

  public async verify(headerToken: string): Promise<TokenDto> {
    try {
      const decoded = await AuthToken.verifyToken<TokenDto>(headerToken);
      if (decoded.os !== "ios" && decoded.os !== "android") return decoded;

      const token = await this.sessionRepository.findTokenByUserId(decoded.id);

      if (token !== headerToken)
        throw new Error(listCodeErrors.sessionNotFound.code);

      await this.sessionRepository.refresh(decoded.id);

      return decoded;
    } catch (error) {
      throw error;
    }
  }

  public async delete(userId: string) {
    try {
      return await this.sessionRepository.delete(userId);
    } catch (error) {
      throw error;
    }
  }
}
