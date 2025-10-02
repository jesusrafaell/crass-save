import * as grpc from "@grpc/grpc-js";
import {
  GetUserRequest,
  GetUserResponse,
  TokenRequest,
  TokenResponse,
  User,
} from "../../../../proto/auth/service";
import { ResponseGRPCHelper } from "../../application/utils/reponseGRPC";
import { AuthTokenService as AuthToken } from "./authToken";
import { TokenDto } from "../models/token";
import { SessionService } from "../../../session/domain/services/session.service";
import { roleToStr } from "../models/roleToken";

export class AuthUserService {
  constructor(private readonly sessionService = new SessionService()) {}

  private defaultAuthError: TokenResponse = {
    userId: "",
    email: "",
    os: "",
    role: "",
    msgError: "Auth (default)",
    codeError: 401,
  };

  public verifyToken = async (
    call: grpc.ServerUnaryCall<TokenRequest, TokenResponse>,
    callback: grpc.sendUnaryData<TokenResponse>
  ): Promise<void> => {
    const { token } = call.request;

    try {
      const data = await AuthToken.verifyToken<TokenDto>(token);

      const response = ResponseGRPCHelper.createTokenResponse({
        userId: data.id,
        email: data.email,
        os: data.os,
        role: roleToStr(data.role),
        msgError: "",
        codeError: 0,
      });
      callback(null, response);
    } catch (error) {
      console.log(error);
      let msgError = "R001V";
      if (error instanceof Error) {
        msgError = error.message;
      }
      const errorResponse = ResponseGRPCHelper.createTokenResponse({
        ...this.defaultAuthError,
        msgError: msgError,
      });
      callback(null, errorResponse);
    }
  };

  public session = async (
    call: grpc.ServerUnaryCall<TokenRequest, TokenResponse>,
    callback: grpc.sendUnaryData<TokenResponse>
  ): Promise<void> => {
    const { token } = call.request;
    try {
      const data = await this.sessionService.verify(token);

      const response = ResponseGRPCHelper.createTokenResponse({
        userId: data.id,
        email: data.email,
        os: data.os,
        role: roleToStr(data.role),
        msgError: "",
        codeError: 0,
      });
      callback(null, response);
    } catch (error) {
      // console.log(error);
      let msgError = "R001V";
      if (error instanceof Error) {
        msgError = error.message;
      }
      const errorResponse = ResponseGRPCHelper.createTokenResponse({
        ...this.defaultAuthError,
        msgError,
      });
      callback(null, errorResponse);
    }
  };

  public getUser = async (
    call: grpc.ServerUnaryCall<GetUserRequest, GetUserResponse>,
    callback: grpc.sendUnaryData<GetUserResponse>
  ) => {
    const { userId } = call.request;

    const user: User = {
      id: "id",
      email: "email",
      firstName: "fist",
      lastName: "last",
      mobile: "mobile",
      distanceRadius: 1,
      fcmToken: "fcm",
      statusEN: "status",
    };

    const response = ResponseGRPCHelper.createUserResponse(user);

    callback(null, response);
  };
}
