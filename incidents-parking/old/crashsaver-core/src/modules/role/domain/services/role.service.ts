import listCodeErrors from "../../../../common/middlewares/listCodeErrors";
import { Role } from "../../../user/domain/model/user";
import { DaoRoleConnector } from "../../infra/connectors/daoRoleConnector";

export class RoleService {
  constructor(private readonly daoRoleConnector = new DaoRoleConnector()) {}

  public async get(id: string) {
    const role = await this.daoRoleConnector.getById(id);

    if (!role) {
      throw new Error(listCodeErrors.userNotFound.code);
    }

    return { role };
  }

  public async getRoles(sort: any, limit: number, skip: number) {
    const roles = await this.daoRoleConnector.getRoles(sort, limit, skip);

    return { roles };
  }

  public async getByName(name: string) {
    const role = await this.daoRoleConnector.getByName(name.toLowerCase());

    if (!role) {
      throw new Error(listCodeErrors.roleNotFound.code);
    }
    return role;
  }

  public async getByKey(key: number) {
    const role = await this.daoRoleConnector.getByKey(key);

    if (!role) {
      throw new Error(listCodeErrors.roleNotFound.code);
    }
    return role;
  }

  public async save(role: Role) {
    return await this.daoRoleConnector.create(role);
  }
}
