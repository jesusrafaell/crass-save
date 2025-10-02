import { DaoUserConnector } from "../../infra/connectors/daoUserConnector";

export class DeleteUserService {
  constructor(private _daoUserConnector = new DaoUserConnector()) {}

  public async deleteUser(id: string) {
    const userDeleted = await this._daoUserConnector.deleteUser(id);

    if (!userDeleted) {
      throw new Error(
        `User doesn't exists: ${id}, UserService method deleteUser`,
      );
    }
  }
}
