import { DeleteResult, InsertOneResult, ModifyResult } from "mongodb";
import { User, UserDB, UserXTruck } from "../../domain/model/user";
import { DaoUserRepository } from "../repository/daoUserRepository";

export class DaoUserConnector {
  constructor(private daoUserRepository = new DaoUserRepository()) {}

  public async getAllUser(sort: any, limit: number, skip: number) {
    return this.daoUserRepository.getAllUser(sort, limit, skip);
  }

  public async createUser(user: User): Promise<InsertOneResult<UserDB>> {
    return this.daoUserRepository.createUser(user);
  }

  public async getUserById(id: string): Promise<UserDB | null> {
    return this.daoUserRepository.getUserById(id);
  }

  public async getUserByEmail(email: string): Promise<UserDB | null> {
    return this.daoUserRepository.getUserByEmail(email);
  }

  public async getUserByPhone(mobile: string): Promise<UserDB | null> {
    return this.daoUserRepository.getUserByPhone(mobile);
  }

  public async updateUser(
    id: string,
    data: Partial<User>,
  ): Promise<ModifyResult<UserDB>> {
    return this.daoUserRepository.updateUser(id, data);
  }

  public async createUserTrunk(
    data: UserXTruck,
  ) {
    return this.daoUserRepository.createUserTruck(data);
  }

  public async deleteUser(id: string): Promise<DeleteResult> {
    return this.daoUserRepository.deleteUser(id);
  }
}
