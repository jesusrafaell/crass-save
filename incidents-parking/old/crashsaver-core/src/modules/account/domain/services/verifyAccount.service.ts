import listCodeErrors from "../../../../common/middlewares/listCodeErrors";
import { GetUserService } from "../../../user/domain/services/getUser.service";
import { UpdateUserService } from "../../../user/domain/services/udpateUser.service";
import { User } from "../../../user/domain/model/user";
import { TokensService } from "../../../verifyToken/domain/services/verifyToken.service";

class VerfifyAccountService {
  constructor(
    private readonly getUserService = new GetUserService(),
    private readonly tokensService = new TokensService(),
    private readonly updateUserService = new UpdateUserService(),
  ) {}

  public async verifyAccount(token: string) {
    try {
      //valid format token
      await this.tokensService.verifyTokenAccount(token);

      //valid exist token db
      const verifyToken = await this.tokensService.getByToken(
        token,
        "verifyEmail",
      );

      //valid exist user
      const { user_id } = verifyToken;

      const { user } = await this.getUserService.getUserById(
        user_id.toString(),
      );

      if (!user) throw new Error(listCodeErrors.userNotFound.code);

      //update status user
      const newStatus: Partial<User> = {
        status: "inactive",
      };
      await this.updateUserService.updateUser(user._id.toString(), newStatus);

      //delete token
      await this.tokensService.delete(verifyToken._id.toString());
      return { email: user.email };
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }
}

export default VerfifyAccountService;
