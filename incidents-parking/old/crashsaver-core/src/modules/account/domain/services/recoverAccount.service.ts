import listCodeErrors from "../../../../common/middlewares/listCodeErrors";
import { GetUserService } from "../../../user/domain/services/getUser.service";
import { UpdateUserService } from "../../../user/domain/services/udpateUser.service";
import ForgotPasswordEmailService from "../../../email/domain/services/forgotPasswordEmail.service";
import { TokensService } from "../../../verifyToken/domain/services/verifyToken.service";

class RecoverAccountService {
  constructor(
    private readonly getUserService = new GetUserService(),
    private readonly tokensService = new TokensService(),
    private readonly updateUserService = new UpdateUserService(),
    private readonly forgotPasswordEmailService = new ForgotPasswordEmailService(),
  ) {}

  public async recoverAccountByEmail(email: string) {
    try {
      //valid user / get user
      const user = await this.getUserService.getUserByEmail(email);

      //generate token
      const { token } = await this.tokensService.createTokenPassowrd(
        user._id.toString(),
        email,
      );

      // send email
      await this.forgotPasswordEmailService.sendMailFogotPassword(
        user.email,
        token,
      );
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async changePasswordByRecover(password: string, token: string) {
    try {
      //verify token is format valid
      await this.tokensService.verifyTokenPassword(token);

      //valid exist token db
      const verifyToken = await this.tokensService.getByToken(
        token,
        "passwordReset",
      );

      //valid exist user
      const { user_id } = verifyToken;

      const { user } = await this.getUserService.getUserById(
        user_id.toString(),
      );

      if (!user) throw new Error(listCodeErrors.userNotFound.code);

      //update status user
      this.updateUserService.changePassword(user._id.toString(), password);

      //delete token
      await this.tokensService.delete(verifyToken._id.toString());

      // send email password changed
      // await this.forgotPasswordEmailService
      //   .send(user.email, token)
      //   .catch(async () => {
      //     throw new Error(listCodeErrors.sendEmail.code);
      //   });
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }
}

export default RecoverAccountService;
