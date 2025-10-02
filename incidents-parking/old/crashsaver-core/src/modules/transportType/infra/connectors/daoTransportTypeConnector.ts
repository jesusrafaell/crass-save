import { TransportTypeDB } from "../../domain/model/transporttypes";
import { DaoTransportTypeRepository } from "../repository/daoTransportTypeRepository";

export class DaoTransportTypeConnector {
  constructor(private daoRoleRepository = new DaoTransportTypeRepository()) {}

  public async getAll(
    sort: any,
    limit: number,
    skip: number,
  ): Promise<TransportTypeDB[]> {
    return this.daoRoleRepository.getAll(sort, limit, skip);
  }

  // public async create(role: Role): Promise<InsertOneResult<RoleDB>> {
  //   return this.daoRoleRepository.createRol(role);
  // }

  public async getById(id: string): Promise<TransportTypeDB | null> {
    return this.daoRoleRepository.getById(id);
  }

  public async getByKey(key: number): Promise<TransportTypeDB | null> {
    return this.daoRoleRepository.getTransportTypeByKey(key);
  }
}
