import { DeleteResult, InsertOneResult } from "mongodb";
import Server from "../../../main/app/server";
import { DataBaseName } from "../../../../common/utils/database_enum";
import {
  TypeVerifyToken,
  VerifyToken,
  VerifyTokenDB,
} from "../../domain/model/token";
import { DbCollections } from "../../../../common/utils/database_collections";

export class DaoTokensRepository {
  private mongoReadConnection = Server.getInstance().MongoReadConnection;
  private mongoWriteConnection = Server.getInstance().MongoWriteConnection;
  private collectionName = DbCollections.verifyTokens;

  public async save(
    token: VerifyToken,
  ): Promise<InsertOneResult<VerifyTokenDB>> {
    try {
      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .insertOne({
          ...token,
          user_id: this.mongoReadConnection.convertObjectId(token.user_id),
          _id: undefined,
        });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoVerifyTokensRepository of save() method`,
      );
    }
  }

  public async getByToken(
    token: string,
    type: TypeVerifyToken,
  ): Promise<VerifyTokenDB | null> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<VerifyTokenDB>(this.collectionName)
        .findOne({ token, type });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoVerifyTokensRepository of getToken() method`,
      );
    }
  }

  public async getByUser(
    userId: string,
    type: TypeVerifyToken,
  ): Promise<VerifyTokenDB | null> {
    try {
      const user_id = this.mongoWriteConnection.convertObjectId(userId);

      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection<VerifyTokenDB>(this.collectionName)
        .findOne({ user_id, type });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoVerifyTokenRepository of getByUser() method`,
      );
    }
  }

  public async delete(id: string): Promise<DeleteResult> {
    try {
      const _id = this.mongoWriteConnection.convertObjectId(id);

      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .deleteOne({ _id });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoVerifyTokenRepository of deleteVerifyToken() method`,
      );
    }
  }
}
