import { InsertOneResult, DeleteResult, ModifyResult } from "mongodb";
import { Role, RoleDB } from "../../../user/domain/model/user";
import Server from "../../../main/app/server";
import { DataBaseName } from "../../../../common/utils/database_enum";
import { DbCollections } from "../../../../common/utils/database_collections";

export class DaoRoleRepository {
  private mongoReadConnection = Server.getInstance().MongoReadConnection;
  private mongoWriteConnection = Server.getInstance().MongoWriteConnection;
  private collectionName = DbCollections.roles;

  public async getRoles(
    sort: any = { _id: -1 },
    limit: number = 50,
    skip: number = 0,
  ): Promise<RoleDB[]> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<RoleDB>(this.collectionName)
        .find()
        .sort(sort)
        .limit(limit + skip)
        .skip(skip)
        .toArray();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoRoleRepository of getRoles() method`,
      );
    }
  }

  public async getRoleById(id: string): Promise<RoleDB | null> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<RoleDB>(this.collectionName)
        .findOne({ _id: this.mongoReadConnection.convertObjectId(id) });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoRoleRepository of getRoleById() method`,
      );
    }
  }

  public async getRoleByKey(key: number): Promise<RoleDB | null> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<RoleDB>(this.collectionName)
        .findOne({ key });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoRoleRepository of getRoleByKey() method`,
      );
    }
  }

  public async getRoleByName(name: string): Promise<RoleDB | null> {
    try {
      return this.mongoReadConnection.client
        .db(DataBaseName.core)
        .collection<RoleDB>(this.collectionName)
        .findOne({ name });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoRoleRepository of getRoleByName() method`,
      );
    }
  }

  public async createRol(role: Role): Promise<InsertOneResult<RoleDB>> {
    try {
      //always lowercase
      role.name = role.name.toLowerCase();
      return this.mongoWriteConnection.client
        .db(DataBaseName.core)
        .collection(this.collectionName)
        .insertOne({
          ...role,
          _id: undefined,
        });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DaoRoleRepository of createRol() method`,
      );
    }
  }

  // public async getUserByPhone(mobile: string): Promise<UserDB | null> {
  //   try {
  //     return this.mongoReadConnection.client
  //       .db(DataBaseName.core)
  //       .collection<UserDB>(this.collectionName)
  //       .findOne({ mobile });
  //   } catch (error) {
  //     const _error = error as Error;
  //     throw new Error(
  //       `${_error.message} in DaoRoleRepository of getUserByPhone() method`,
  //     );
  //   }
  // }

  // public async deleteUser(id: string): Promise<DeleteResult> {
  //   try {
  //     const _id = this.mongoWriteConnection.convertObjectId(id);

  //     return this.mongoWriteConnection.client
  //       .db(DataBaseName.core)
  //       .collection(this.collectionName)
  //       .deleteOne({ _id });
  //   } catch (error) {
  //     const _error = error as Error;
  //     throw new Error(
  //       `${_error.message} in DaoRoleRepository of deleteUser() method`,
  //     );
  //   }
  // }
}
