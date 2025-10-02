import { VerifyToken, TypeVerifyToken } from "../../domain/models";
import VerifyTokenModel from "../../domain/models/verifyToken.schema";
import { ObjectId } from "mongodb";
import { DeleteResult } from "mongodb";

export class VerifyTokenRepository {
  public async getByToken(
    token: string,
    type: TypeVerifyToken
  ): Promise<VerifyToken | null> {
    try {
      return await VerifyTokenModel.findOne({ token, type });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in VerifyTokenRepository of getByToken() method`
      );
    }
  }

  public async getByUser(
    userId: string,
    type: TypeVerifyToken
  ): Promise<VerifyToken | null> {
    try {
      return await VerifyTokenModel.findOne({ userId, type });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in VerifyTokenRepository of getByUser() method`
      );
    }
  }

  public async create(tokenData: VerifyToken): Promise<VerifyToken> {
    try {
      const tokenDB = new VerifyTokenModel(tokenData);
      return tokenDB.save();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in VerifyTokenRepository of save() method`
      );
    }
  }

  public async delete(_id: ObjectId): Promise<DeleteResult> {
    try {
      return VerifyTokenModel.deleteOne({ _id });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in VerifyTokenRepository of delete() method`
      );
    }
  }
}
