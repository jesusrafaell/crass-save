import Server from "../../../main/app/server";
import { DataBaseName } from "../../../../common/utils/database_enum";
import { DbCollections } from "../../../../common/utils/database_collections";
import { Version } from "../../domain/model/version";
import { ModifyResult } from "mongodb";

export class VersionRepository {
  private mongoReadConnection = Server.getInstance().MongoReadConnection;
  private mongoWriteConnection = Server.getInstance().MongoWriteConnection;
  private collectionName = DbCollections.versions;

  public async get(): Promise<Version|null> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<Version>(this.collectionName)
        .findOne();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in VersionRepository of get() method`,
      );
    }
  }

  public async update(
    id: string,
    data: Partial<Version>
  ): Promise<ModifyResult<Version>> {
    try {
      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .findOneAndUpdate(
          {
            _id: this.mongoWriteConnection.convertObjectId(id),
          },
          { $set: data },
          { returnDocument: "after" },
        )
        .then();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in VersionRepository of update() method`,
      );
    }
  }
}