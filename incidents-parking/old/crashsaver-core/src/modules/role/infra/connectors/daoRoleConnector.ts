import { InsertOneResult } from "mongodb";
import { DaoRoleRepository } from "../repository/daoRoleRepository";
import { Role, RoleDB } from "../../../user/domain/model/user";

export class DaoRoleConnector {
  constructor(private daoRoleRepository = new DaoRoleRepository()) {}

  public async getRoles(
    sort: any,
    limit: number,
    skip: number,
  ): Promise<RoleDB[]> {
    return this.daoRoleRepository.getRoles(sort, limit, skip);
  }

  public async create(role: Role): Promise<InsertOneResult<RoleDB>> {
    return this.daoRoleRepository.createRol(role);
  }

  public async getById(id: string): Promise<RoleDB | null> {
    return this.daoRoleRepository.getRoleById(id);
  }

  public async getByKey(key: number): Promise<RoleDB | null> {
    return this.daoRoleRepository.getRoleByKey(key);
  }

  public async getByName(name: string): Promise<RoleDB | null> {
    return this.daoRoleRepository.getRoleByName(name);
  }
}
