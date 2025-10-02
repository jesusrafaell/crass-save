import { DaoUserConnector } from "../../infra/connectors/daoUserConnector";
import listCodeErrors from "../../../../common/middlewares/listCodeErrors";

export class GetUserService {
  constructor(private readonly _daoUserConnector = new DaoUserConnector()) {}

  public async getUserById(id: string) {
    const user = await this._daoUserConnector.getUserById(id);

    if (!user) {
      throw new Error(listCodeErrors.userNotFound.code);
    }

    return { user };
  }

  public async getAllUser(sort: any, limit: number, skip: number) {
    const users = await this._daoUserConnector.getAllUser(sort, limit, skip);

    return { users };
  }

  public async getUserByEmail(email: string) {
    const user = await this._daoUserConnector.getUserByEmail(email);

    if (!user) {
      throw new Error(listCodeErrors.userNotFound.code);
    }
    return user;
  }

  public async validExistUser(email: string, mobile: string) {
    if (await this._daoUserConnector.getUserByEmail(email)) {
      throw new Error(listCodeErrors.emailExist.code);
    }

    if (await this._daoUserConnector.getUserByPhone(mobile)) {
      throw new Error(listCodeErrors.mobileExist.code);
    }
  }
}
