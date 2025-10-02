import { InsertOneResult, DeleteResult, ModifyResult } from "mongodb";
import { Localization, LocalizationDB } from "../../domain/model/localization";
import Server from "../../../main/app/server";
import { DataBaseName } from "../../../../common/utils/database_enum";
import { DTODataByRadius } from "../../../incident/domain/model/incident";
import {
  latitudeToKm,
  longitudeToKm,
} from "../../../incident/app/functions/convertToKm";
import { DbCollections } from "../../../../common/utils/database_collections";

export class DaoLocalizationRepository {
  private mongoReadConnection = Server.getInstance().MongoReadConnection;
  private mongoWriteConnection = Server.getInstance().MongoWriteConnection;
  private collectionName = DbCollections.userLocations;

  public async createLocalization(
    localization: Localization,
  ): Promise<InsertOneResult<LocalizationDB>> {
    try {
      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .insertOne({
          ...localization,
          user_id: this.mongoReadConnection.convertObjectId(
            localization.user_id,
          ),
          _id: undefined,
        });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoLocalizationRepository of createLocalization() method`,
      );
    }
  }

  public async getLocalizationById(id: string): Promise<Localization> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .findOne({ _id: this.mongoReadConnection.convertObjectId(id) })
        .then();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoLocalizationRepository of getLocalizationById() method`,
      );
    }
  }

  public async getLocalizationByUserId(
    userId: string,
  ): Promise<LocalizationDB> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<LocalizationDB>(this.collectionName)
        .findOne({ user_id: this.mongoReadConnection.convertObjectId(userId) })
        .then();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoLocalizationRepository of getLocalizationById() method`,
      );
    }
  }

  public async updateLocalization(
    id: string,
    data: Partial<Localization>,
  ): Promise<ModifyResult<Localization>> {
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
        `${_error.message} in DaoLocalizationRepository of updateLocalization() method`,
      );
    }
  }

  public async deleteLocalization(id: string): Promise<DeleteResult> {
    try {
      const _id = this.mongoWriteConnection.convertObjectId(id);

      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .deleteOne({ _id });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoLocalizationRepository of deleteLocalization() method`,
      );
    }
  }

  public async getLocalizationsInRadius(
    sort: any,
    limit: number,
    skip: number,
    data: DTODataByRadius,
  ): Promise<Localization[]> {
    try {
      sort = sort || { _id: -1 };
      limit = limit + skip || 50;
      const { latitude, longitude, radius } = data;

      const radiusMeters = radius / 1000;

      const incidents = await this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<Localization>(this.collectionName)
        .find({
          user_latitude: {
            $gte: latitude - latitudeToKm(radiusMeters),
            $lte: latitude + latitudeToKm(radiusMeters),
          },
          user_longitude: {
            $gte: longitude - longitudeToKm(radiusMeters, latitude),
            $lte: longitude + longitudeToKm(radiusMeters, latitude),
          },
        })
        .sort(sort)
        .limit(limit || 50)
        .skip(skip || 0)
        .toArray();

      return incidents;
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoIncidentRepository of getIncidentsByUser() method`,
      );
    }
  }

  public async getLocalizationsGeospatial(
    data: DTODataByRadius,
  ): Promise<Localization[]> {
    try {
      const { latitude, longitude, radius } = data;

      const radiusKm = radius / 1000;

      const incidents = await this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<Localization>(this.collectionName)
        .find({
          location: {
            $geoWithin: {
              $centerSphere: [[longitude, latitude], radiusKm / 6371],
            },
          },
        })
        .toArray();

      return incidents;
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoIncidentRepository of getIncidentsByUser() method`,
      );
    }
  }

  public async updateLocalizationByUser(
    user_id: string,
    location: Partial<LocalizationDB>,
  ): Promise<ModifyResult<LocalizationDB>> {
    try {
      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection<LocalizationDB>(this.collectionName)
        .findOneAndUpdate(
          {
            user_id: this.mongoWriteConnection.convertObjectId(user_id),
          },
          { $set: location },
          { returnDocument: "after" },
        );
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoLocalizationRepository of updateLocalizationByUser() method`,
      );
    }
  }
}
