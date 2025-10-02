import { User } from "../../../user/domain/model/user";
import { GetUserService } from "../../../user/domain/services/getUser.service";
import { UpdateUserService } from "../../../user/domain/services/udpateUser.service";
import { DeleteAccountService } from "./deleteAccount.service";

interface UserLogin extends Omit<User, "password"> {}

export class LogoutService {
  constructor(
    private readonly getUserService = new GetUserService(),
    private readonly updateUserService = new UpdateUserService(),
    private readonly deleteAccountService = new DeleteAccountService(),
  ) {}

  public async logout(user_id: string) {
    try {
      const { user } = await this.getUserService.getUserById(user_id);

      if (user.is_guest) {
        //guest remove account
        await this.deleteAccountService.deleteAccount(user_id);
      } else {
        //user -> active:false
        const newData: Partial<User> = {
          status: "inactive",
        };
        await this.updateUserService.updateUser(user_id, newData);
      }
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }
}
