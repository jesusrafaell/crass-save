import {
  GetUserResponse,
  TokenResponse,
  User,
} from "../../../../proto/auth/service";

export class ResponseGRPCHelper {
  static createTokenResponse(data: TokenResponse): TokenResponse {
    return TokenResponse.fromPartial(data);
  }

  static createUserResponse(user: User): GetUserResponse {
    return GetUserResponse.fromPartial({ user });
  }
}
