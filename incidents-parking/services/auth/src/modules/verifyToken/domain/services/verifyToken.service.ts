import { TypeVerifyToken, VerifyToken, TokenVerifyDto } from "../models";
import jwt, { SignOptions } from "jsonwebtoken";
import listCodeErrors from "../../../../common/utils/listCodeErrors";
import { VerifyTokenRepository } from "../../infraestructure/repository/verifyTokenRepository";
import {
  urlEncodeToken,
  verifyToken,
  verifyTokenURI,
} from "../../../../common/utils/token";
import { nativeCurrentUnixTime } from "../../../../common/utils/unixTime";
import { ObjectId } from "mongodb";
// import { AuthTokenService as AuthToken } from "../../../authToken/domain/services/authToken";

export class VerifyTokensService {
  private readonly verify_key_password = process.env
    .VERIFY_KEY_PASSWORD as string;
  private readonly verify_key_account = process.env
    .VERIFY_KEY_ACCOUNT as string;
  private readonly verify_key_driver = process.env.VERIFY_KEY_DRIVER as string;

  constructor(
    private readonly verifyTokenRepository = new VerifyTokenRepository()
  ) {}

  private getKey(type: TypeVerifyToken): string {
    switch (type) {
      case "verifyEmail":
        return this.verify_key_account;

      case "passwordReset":
        return this.verify_key_password;

      case "driverxcompany":
        return this.verify_key_driver;
    }
  }

  private generateToken(
    payload: TokenVerifyDto,
    secret: string,
    expiresIn?: number
  ): string {
    try {
      const options: SignOptions = {};

      if (expiresIn) options.expiresIn = expiresIn;
      const token = jwt.sign(payload, secret, options);
      const base64UrlToken = urlEncodeToken(token);
      //url-encode token
      return encodeURIComponent(base64UrlToken);
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `Error in VerifyTokensService in generateToken() method: ${_error.message}`
      );
    }
  }

  public async delete(id: ObjectId) {
    try {
      await this.verifyTokenRepository.delete(id);
    } catch (error) {
      throw new Error(listCodeErrors.invalidToken.code);
    }
  }

  public async createTokenPassowrd(userId: string, email: string) {
    try {
      //exit token
      const preToken = await this.verifyTokenRepository.getByUser(
        userId,
        "passwordReset"
      );
      if (preToken) {
        this.delete(preToken._id);
      }

      //generate new token restore password
      const payload: TokenVerifyDto = {
        id: userId,
        email: email,
      };
      const currentTime = nativeCurrentUnixTime();

      //generate token and time
      const token = this.generateToken(
        payload,
        this.verify_key_password,
        60 * 60 * 24 //1 day
      );

      const verifyToken: VerifyToken = {
        _id: new ObjectId(),
        token,
        userId: payload.id,
        createdAt: currentTime,
        type: "passwordReset",
      };

      await this.verifyTokenRepository.create(verifyToken);

      return { token };
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async createTokenAccount(userId: string, email: string) {
    try {
      //generate token
      const payload: TokenVerifyDto = {
        id: userId,
        email: email,
      };

      const currentTime = nativeCurrentUnixTime();

      //generate token verify is diferent to this
      const token = this.generateToken(payload, this.verify_key_account);

      const verifyToken: VerifyToken = {
        _id: new ObjectId(),
        token,
        userId: payload.id,
        createdAt: currentTime,
        type: "verifyEmail",
      };

      //save token in db
      await this.verifyTokenRepository.create(verifyToken);

      return { token };
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async createTokenDriver(
    email: string,
    driverId: string,
    companyId: string
  ) {
    try {
      //generate token
      const payload: TokenVerifyDto = {
        id: driverId,
        email,
      };

      const currentTime = nativeCurrentUnixTime();

      //generate token verify is diferent to this
      const token = this.generateToken(payload, this.verify_key_driver);

      const verifyToken: VerifyToken = {
        _id: new ObjectId(),
        token,
        userId: payload.id,
        companyId,
        createdAt: currentTime,
        type: "driverxcompany",
      };

      //save token in db
      await this.verifyTokenRepository.create(verifyToken);

      return { token };
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async getByToken(token: string, type: TypeVerifyToken) {
    await verifyToken<TokenVerifyDto>(token, this.getKey(type));
    //valid
    const dataToken = await this.verifyTokenRepository.getByToken(token, type);
    if (!dataToken) throw new Error(listCodeErrors.invalidToken.code);

    return dataToken;
  }

  public async getByTokenURI(token: string, type: TypeVerifyToken) {
    await verifyTokenURI<TokenVerifyDto>(token, this.getKey(type));
    //valid
    const dataToken = await this.verifyTokenRepository.getByToken(token, type);
    if (!dataToken) throw new Error(listCodeErrors.invalidToken.code);

    return dataToken;
  }
}
