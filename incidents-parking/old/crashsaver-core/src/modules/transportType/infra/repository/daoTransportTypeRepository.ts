import Server from "../../../main/app/server";
import { DataBaseName } from "../../../../common/utils/database_enum";
import { DbCollections } from "../../../../common/utils/database_collections";
import { TransportTypeDB } from "../../domain/model/transporttypes";

export class DaoTransportTypeRepository {
  private mongoReadConnection = Server.getInstance().MongoReadConnection;
  // private mongoWriteConnection = Server.getInstance().MongoWriteConnection;
  private collectionName = DbCollections.transportTypes;

  public async getAll(
    sort: any = { _id: -1 },
    limit: number = 50,
    skip: number = 0,
  ): Promise<TransportTypeDB[]> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<TransportTypeDB>(this.collectionName)
        .find({}, { projection: { _id: 0 } }) 
        .sort(sort)
        .limit(limit + skip)
        .skip(skip)
        .toArray();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoTransportTypeRepository of getTransportType() method`,
      );
    }
  }

  public async getById(
    id: string,
  ): Promise<TransportTypeDB | null> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<TransportTypeDB>(this.collectionName)
        .findOne({ _id: this.mongoReadConnection.convertObjectId(id) });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoTransportTypeRepository of getTransportTypeById() method`,
      );
    }
  }

  public async getTransportTypeByKey(
    key: number,
  ): Promise<TransportTypeDB | null> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<TransportTypeDB>(this.collectionName)
        .findOne({ key });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoTransportTypeRepository of getTransportTypeByKey() method`,
      );
    }
  }
}
