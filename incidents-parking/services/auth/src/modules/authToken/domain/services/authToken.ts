// Dependencias
import dotenvFlow from "dotenv-flow";
import fs from "fs";
import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import path from "path";
import listCodeErrors from "../../../../common/utils/listCodeErrors";

// Configuraciones
dotenvFlow.config({
  silent: true,
});

const publicKey = fs.readFileSync(
  path.basename("./jwtPublicRS256.key"),
  "utf-8"
);

const privateKey = fs.readFileSync(
  path.basename("./jwtPrivateRS256.key"),
  "utf-8"
);

export class AuthTokenService {
  static verifyToken<T>(
    token: string,
    opt: VerifyOptions = {},
    secret = publicKey
  ): Promise<T> {
    const options: VerifyOptions = { algorithms: ["RS256"], ...opt };
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, options, (error, decoded) => {
        if (error) {
          if (error instanceof jwt.TokenExpiredError) {
            // Token has expired
            reject(new Error(listCodeErrors.expiredToken.code));
          }
          reject(new Error(listCodeErrors.invalidToken.code));
        } else {
          resolve(decoded as T);
        }
      });
    });
  }

  static generateToken<T extends Buffer | object | string>(
    payload: T,
    opt: SignOptions = {},
    secret = privateKey
  ): string {
    try {
      const options: SignOptions = { algorithm: "RS256", ...opt };
      return jwt.sign(payload, secret, options);
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `Error in AuthToken's generateToken() method: ${_error.message}`
      );
    }
  }

  static verifyTokenURI<T>(
    tokenURI: string,
    opt: VerifyOptions = {},
    secret: string = publicKey
  ): Promise<T> {
    const base64UrlToken = decodeURIComponent(tokenURI);
    const token = Buffer.from(base64UrlToken, "base64").toString("utf8");

    return this.verifyToken<T>(token, opt, secret);
  }
}
