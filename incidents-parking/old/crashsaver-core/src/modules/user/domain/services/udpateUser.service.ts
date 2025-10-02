import bcrypt from "bcrypt";
import { DaoUserConnector } from "../../infra/connectors/daoUserConnector";
import { User } from "../model/user";
import listCodeErrors from "../../../../common/middlewares/listCodeErrors";
import { MomentAdapter } from "../../../../common/adapters/momentAdapter";

interface userTruck{
  userId: string;
  licensePlate: string;
}

export class UpdateUserService {
  constructor(
    private _daoUserConnector = new DaoUserConnector(),
    private momentAdapter = new MomentAdapter(""),
  ) {}

  public async updateUser(id: string, data: Partial<User>, truck?: userTruck) {
    data.updated_time = this.momentAdapter.dateUnix();

    const userUpdated = await this._daoUserConnector.updateUser(id, data);

    if (truck) {
      const res =await this._daoUserConnector.createUserTrunk({
        _id: "",
        userId: truck.userId,
        licensePlate: truck.licensePlate,
        created_at: this.momentAdapter.dateUnix(),
        updated_at: this.momentAdapter.dateUnix(),
      });
    }

    if (!userUpdated) throw new Error(listCodeErrors.userNotFound.code);

    return { userUpdated };
  }

  public async changePassword(id: string, newPassword: string) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    const data: Partial<User> = {
      password: passwordHash,
      updated_time: this.momentAdapter.dateUnix(),
    };
    const userUpdated = await this._daoUserConnector.updateUser(id, data);
    if (!userUpdated) throw new Error(listCodeErrors.userNotFound.code);
  }
}
