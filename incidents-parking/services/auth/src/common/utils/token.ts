import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import listCodeErrors from "./listCodeErrors";

export const urlEncodeToken = (token: string) => {
  const base64UrlToken = Buffer.from(token)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return base64UrlToken;
};

export function verifyToken<T>(
  token: string,
  secret: string,
  options: VerifyOptions = {}
): Promise<T> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (error, decoded) => {
      if (error) {
        if (error instanceof jwt.TokenExpiredError) {
          // Token has expired
          console.log("bug1");
          reject(new Error(listCodeErrors.expiredToken.code));
        }
        console.log("bug2");
        reject(new Error(listCodeErrors.invalidToken.code));
      } else {
        resolve(decoded as T);
      }
    });
  });
}

export function verifyTokenURI<T>(
  tokenURI: string,
  secret: string
): Promise<T> {
  const base64UrlToken = decodeURIComponent(tokenURI);
  const token = Buffer.from(base64UrlToken, "base64").toString("utf8");

  return verifyToken<T>(token, secret);
}

export function generateToken(
  payload: string | object | Buffer,
  secret: string,
  options: SignOptions = {}
): string {
  return jwt.sign(payload, secret, options);
}
