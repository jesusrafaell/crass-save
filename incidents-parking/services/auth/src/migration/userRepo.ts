import { MongoClient } from "mongodb";
import { UserCore } from "./user.model";
import { dbNameCore } from ".";

export class UserRepoCore {
  private mongoClient: MongoClient;
  private collection = "users";
  constructor(mongoClient: MongoClient) {
    this.mongoClient = mongoClient;
  }
  public async getAllUser(): Promise<UserCore[]> {
    try {
      return this.mongoClient
        .db(dbNameCore)
        .collection<UserCore>(this.collection)
        .find()
        .toArray();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in UserRepoCore of getAllUser() method`
      );
    }
  }
}
