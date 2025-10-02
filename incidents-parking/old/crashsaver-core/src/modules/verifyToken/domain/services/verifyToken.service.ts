import { SchemaValidatorAdapter } from "../../../../common/adapters/schemaValidatorAdapter";
import { MomentAdapter } from "../../../../common/adapters/momentAdapter";
import { VerifyTokenSchema } from "../model/tokenSchema";
import { DaoVerifyTokenConnector } from "../../infra/connectors/daoVerifyTokenConnector";
import { TypeVerifyToken, VerifyToken, TokenDto } from "../model/token";
import jwt, { SignOptions } from "jsonwebtoken";
import dotenvFlow from "dotenv-flow";
import listCodeErrors from "../../../../common/middlewares/listCodeErrors";

// Configuraciones
dotenvFlow.config({
  silent: true,
});

export class TokensService {
  private readonly verify_key_account = process.env
    .VERIFY_KEY_ACCOUNT as string;
  private readonly verify_key_password = process.env
    .VERIFY_KEY_PASSWORD as string;

  constructor(
    private readonly daoVerifyTokenConnector = new DaoVerifyTokenConnector(),
    private readonly momentAdapter = new MomentAdapter(""),
    private readonly _schemaValidatorAdapter = new SchemaValidatorAdapter(),
  ) {}

  public async createTokenAccount(user_id: string, email: string) {
    try {
      //generate token
      const payload: TokenDto = {
        _id: user_id,
        email: email,
      };

      const currentTime = this.momentAdapter.dateUnix();

      //generate token verify is diferent to this
      const token = this.generateToken(payload, this.verify_key_account);

      const verifyToken: VerifyToken = {
        token,
        user_id: payload._id,
        created_time: currentTime,
        updated_time: currentTime,
        type: "verifyEmail",
      };

      this._schemaValidatorAdapter.compileSchema(VerifyTokenSchema);
      this._schemaValidatorAdapter.verifySchema(verifyToken);

      //save token in db
      await this.daoVerifyTokenConnector.save(verifyToken);

      return { token };
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async verifyTokenAccount(tokenURI: string): Promise<TokenDto> {
    const base64UrlToken = decodeURIComponent(tokenURI);
    const token = Buffer.from(base64UrlToken, "base64").toString("utf8");
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.verify_key_account, (error, decoded) => {
        if (error) {
          reject(new Error(listCodeErrors.invalidToken.code));
        } else {
          resolve(decoded as TokenDto);
        }
      });
    });
  }

  public async createTokenPassowrd(user_id: string, email: string) {
    try {
      //exit token
      const preToken = await this.daoVerifyTokenConnector.getByUser(
        user_id,
        "passwordReset",
      );
      if (preToken) {
        //remove token (disable token)
        this.delete(preToken._id.toString());
      }

      //generate new token restore password
      const payload: TokenDto = {
        _id: user_id,
        email: email,
      };
      const currentTime = this.momentAdapter.dateUnix();

      //generate token and time
      const token = this.generateToken(
        payload,
        this.verify_key_password,
        60 * 60 * 24, //1 day
      );

      const verifyToken: VerifyToken = {
        token,
        user_id: payload._id,
        created_time: currentTime,
        updated_time: currentTime,
        type: "passwordReset",
      };

      this._schemaValidatorAdapter.compileSchema(VerifyTokenSchema);
      this._schemaValidatorAdapter.verifySchema(verifyToken);

      //save token in db
      await this.daoVerifyTokenConnector.save(verifyToken);

      return { token };
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async verifyTokenPassword(tokenURI: string): Promise<TokenDto> {
    const base64UrlToken = decodeURIComponent(tokenURI);
    const token = Buffer.from(base64UrlToken, "base64").toString("utf8");
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.verify_key_password, (error, decoded) => {
        if (error) {
          if (error instanceof jwt.TokenExpiredError) {
            // Token has expired
            reject(new Error(listCodeErrors.expiredToken.code));
          }
          reject(new Error(listCodeErrors.invalidToken.code));
        } else {
          resolve(decoded as TokenDto);
        }
      });
    });
  }

  public async getByToken(token: string, type: TypeVerifyToken) {
    const dataToken = await this.daoVerifyTokenConnector.getByToken(
      token,
      type,
    );
    if (!dataToken) {
      throw new Error(listCodeErrors.invalidToken.code);
    }
    return dataToken;
  }

  public async delete(id: string) {
    try {
      await this.daoVerifyTokenConnector.delete(id);
    } catch (error) {
      throw new Error(listCodeErrors.invalidToken.code);
    }
  }

  private generateToken(
    payload: TokenDto,
    secret: string,
    expiresIn?: number,
  ): string {
    try {
      const options: SignOptions = {};
      if (expiresIn) {
        options.expiresIn = expiresIn;
      }

      const token = jwt.sign(payload, secret, options);
      const base64UrlToken = this.urlEncodeToken(token);
      //url-encode token
      return encodeURIComponent(base64UrlToken);
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `Error in AuthToken's generateToken() method: ${_error.message}`,
      );
    }
  }

  private urlEncodeToken(token: string) {
    const base64UrlToken = Buffer.from(token)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    return base64UrlToken;
  }
}
