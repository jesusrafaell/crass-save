import { InsertOneResult, DeleteResult, ModifyResult } from "mongodb";
import { User, UserDB, UserXTruck } from "../../domain/model/user";
import Server from "../../../main/app/server";
import { DataBaseName } from "../../../../common/utils/database_enum";
import { DbCollections } from "../../../../common/utils/database_collections";

export class DaoUserRepository {
  private mongoReadConnection = Server.getInstance().MongoReadConnection;
  private mongoWriteConnection = Server.getInstance().MongoWriteConnection;
  private collectionName = DbCollections.users;
  private collectionUserXTruck = DbCollections.user_Truck;

  public async getAllUser(
    sort: any = { _id: -1 },
    limit: number = 50,
    skip: number = 0,
  ): Promise<UserDB[]> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<UserDB>(this.collectionName)
        .find()
        .sort(sort)
        .limit(limit + skip)
        .skip(skip)
        .toArray();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in daoUserRepository of getAllUser() method`,
      );
    }
  }

  public async createUser(user: User): Promise<InsertOneResult<UserDB>> {
    try {
      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .insertOne({
          ...user,
        });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoUserRepository of createUser() method`,
      );
    }
  }

  public async getUserById(id: string): Promise<UserDB | null> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<UserDB>(this.collectionName)
        .findOne({ _id: this.mongoReadConnection.convertObjectId(id) });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoUserRepository of getUserById() method`,
      );
    }
  }

  public async getUserByEmail(email: string): Promise<UserDB | null> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<UserDB>(this.collectionName)
        .findOne({ email });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoUserRepository of getUserByEmail() method`,
      );
    }
  }

  public async getUserByPhone(mobile: string): Promise<UserDB | null> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<UserDB>(this.collectionName)
        .findOne({ mobile });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoUserRepository of getUserByPhone() method`,
      );
    }
  }

  public async updateUser(
    id: string,
    data: Partial<User>,
  ): Promise<ModifyResult<UserDB>> {
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
        `${_error.message} in DaoUserRepository of updateUser() method`,
      );
    }
  }

  public async deleteUser(id: string): Promise<DeleteResult> {
    try {
      const _id = this.mongoWriteConnection.convertObjectId(id);

      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .deleteOne({ _id });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoUserRepository of deleteUser() method`,
      );
    }
  }

  public async getUserData(id: string) {
    try {
      const _id = this.mongoReadConnection.convertObjectId(id);
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<UserDB>(this.collectionName)
        .aggregate([
          {
            $match: {
              _id: _id, //filter
            },
          },
          {
            $addFields: {
              role_id: {
                $toObjectId: "$role_id", // Convierte to ObjectId
              },
            },
          },
          {
            $lookup: {
              from: "roles",
              localField: "role_id",
              foreignField: "_id",
              as: "role",
            },
          },
          {
            $unwind: "$role", //when is unique result
          },
          {
            $project: {
              _id: 1,
              first_name: 1,
              last_name: 1,
              email: 1,
              password: 1,
              mobile: 1,
              image: 1,
              status: 1,
              distance_radius: 1,
              role: "$role",
              utc: 1,
              created_time: 1,
              updated_time: 1,
              fcm_token: 1,
            },
          },
        ]);
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in daoUserRepository of getUserData() method`,
      );
    }
  }

  public async createUserTruck(
    data: UserXTruck,
  ): Promise<InsertOneResult<UserXTruck>> {
    try {
      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionUserXTruck)
        .insertOne({
          userId: data.userId,
          licensePlate: data.licensePlate,
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoUserRepository of createUserTruck() method`,
      );
    }
  }
}
