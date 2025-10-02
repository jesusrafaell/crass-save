// Dependencias
import dotenvFlow from "dotenv-flow";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import jwt, { SignOptions } from "jsonwebtoken";
import path from "path";
import { DtoToken } from "../../modules/verifyToken/domain/model/token";
import listPublicRoutes from "./listPulicRoutes";
import listCodeErrors from "./listCodeErrors";
import ResponseExpress from "../adapters/responseExpressAdapter";

// Configuraciones
dotenvFlow.config({
  silent: true,
});

const publicKey = fs.readFileSync(
  path.basename("./jwtPublicRS256.key"),
  "utf-8",
);

const privateKey = fs.readFileSync(
  path.basename("./jwtPrivateRS256.key"),
  "utf-8",
);

export class AuthToken {
  public authToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const validUrl = listPublicRoutes.some((route) =>
        req.path.includes(route),
      );

      if (validUrl) {
        return next();
      }

      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          error: listCodeErrors.notKeyAutohization.code,
          name: "Error",
          ok: false,
        });
      }

      const decoded = await this.verifyToken(token);

      req.body.clientData = decoded as DtoToken;
      req.body.token = token;
      if (decoded.id === "" || decoded.id === undefined){
        throw new Error(
          `Error in id no autorization`,
        );
      }
      // req.body.userId = decoded._id
      // req.body.userId = 

      next();
    } catch (error) {
      const _error = error as Error;
      const responseExpress = new ResponseExpress();
      _error.message = _error.message || "Unknown error in token verification";
      return responseExpress.authErrorResponse(res, _error);
    }
  };

  private verifyToken(token: string): Promise<DtoToken> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        publicKey,
        { algorithms: ["RS256"] },
        (error, decoded) => {
          if (error) {
            if (error instanceof jwt.TokenExpiredError) {
              // Token has expired
              reject(new Error(listCodeErrors.expiredToken.code));
            }
            reject(new Error(listCodeErrors.invalidToken.code));
          } else {
            resolve(decoded as DtoToken);
          }
        },
      );
    });
  }

  public generateToken(payload: DtoToken, expiresIn?: number): string {
    try {
      const options: SignOptions = {
        algorithm: "RS256",
      };
      if (expiresIn) {
        options.expiresIn = expiresIn;
      }
      return jwt.sign(payload, privateKey, options);
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `Error in AuthToken's generateToken() method: ${_error.message}`,
      );
    }
  }
}
