import { InsertOneResult, DeleteResult, ModifyResult } from "mongodb";
import { IncidentNotificationDB } from "../../domain/model/incidentNotification";
import Server from "../../../main/app/server";
import { DataBaseName } from "../../../../common/utils/database_enum";
import { DbCollections } from "../../../../common/utils/database_collections";

export class DaoIncidentNotificationRepository {
  private mongoReadConnection = Server.getInstance().MongoReadConnection;
  private mongoWriteConnection = Server.getInstance().MongoWriteConnection;
  private collectionName = DbCollections.incidentNotifications;

  public async getAllIncidentNotification(
    sort: any,
    limit: number,
    skip: number,
  ): Promise<IncidentNotificationDB[]> {
    try {
      sort = sort || { _id: -1 };
      limit = limit + skip || 50;

      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .find()
        .sort(sort)
        .limit(limit || 50)
        .skip(skip || 0)
        .toArray()
        .then();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoIncidentNotificationRepository of getAllIncidentNotification() method`,
      );
    }
  }

  public async getIncidentNotificationsByIncident(
    sort: any,
    limit: number,
    skip: number,
  ): Promise<IncidentNotificationDB[]> {
    try {
      sort = sort || { _id: -1 };
      limit = limit + skip || 50;

      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .find()
        .sort(sort)
        .limit(limit || 50)
        .skip(skip || 0)
        .toArray()
        .then();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoIncidentNotificationRepository of getIncidentNotificationsByIncident() method`,
      );
    }
  }

  public async createIncidentNofication(
    incidentNotification: IncidentNotificationDB,
  ): Promise<InsertOneResult<IncidentNotificationDB>> {
    try {
      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .insertOne({
          ...incidentNotification,
          _id: undefined,
        });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoIncidentNotificationRepository of createIncidentNofication() method`,
      );
    }
  }

  public async getIncidentNoficationById(
    id: string,
  ): Promise<IncidentNotificationDB> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .findOne({ _id: this.mongoReadConnection.convertObjectId(id) })
        .then();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoIncidentNotificationRepository of getIncidentNoficationById() method`,
      );
    }
  }

  public async getIncidentsNoficationByUserId(
    sort: any,
    limit: number,
    skip: number,
    user_id: string,
  ): Promise<IncidentNotificationDB[]> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .find({ user_id: this.mongoReadConnection.convertObjectId(user_id) })
        .sort(sort)
        .limit(limit || 50)
        .skip(skip || 0)
        .toArray()
        .then();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoIncidentNotificationRepository of getIncidentNoficationByUserId() method`,
      );
    }
  }

  public async updateIncidentNofication(
    id: string,
    data: any,
  ): Promise<ModifyResult<IncidentNotificationDB>> {
    try {
      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .findOneAndUpdate(
          { _id: this.mongoWriteConnection.convertObjectId(id) },
          { $set: data },
          { returnDocument: "after" },
        )
        .then();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoIncidentNotificationRepository of updateIncidentNofication() method`,
      );
    }
  }

  public async deleteIncidentNofication(id: string): Promise<DeleteResult> {
    try {
      const _id = this.mongoWriteConnection.convertObjectId(id);

      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .deleteOne(_id);
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoIncidentNotificationRepository of deleteIncidentNofication() method`,
      );
    }
  }
}
