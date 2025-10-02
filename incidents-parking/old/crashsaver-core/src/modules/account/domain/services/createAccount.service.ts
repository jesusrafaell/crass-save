import listCodeErrors from "../../../../common/middlewares/listCodeErrors";
import VerificationEmailService from "../../../email/domain/services/verificationEmail.service";
import { DTOCreateLocalization } from "../../../localization/domain/model/localization";
import { CreateLocalizationService } from "../../../localization/domain/services/createLocalization.service";
import { RegisterUser } from "../../../user/domain/model/user";
import { CreateUserService } from "../../../user/domain/services/createUser.service";
import { GetUserService } from "../../../user/domain/services/getUser.service";
import { TokensService } from "../../../verifyToken/domain/services/verifyToken.service";
import { DeleteAccountService } from "./deleteAccount.service";

export class CreateAccountService {
  constructor(
    private readonly getUserService = new GetUserService(),
    private readonly createUserService = new CreateUserService(),
    private readonly createLocalizationService = new CreateLocalizationService(),
    private readonly emailService = new VerificationEmailService(),
    private readonly tokensService = new TokensService(),
    private readonly deleteAccountService = new DeleteAccountService(),
  ) {}

  public async createAccount(user: RegisterUser) {
    try {
      //valid exist user
      await this.getUserService.validExistUser(user.email, user.mobile);

      //create user
      const newUser = await this.createUserService.createUser(user);

      //crete localization user
      const localization: DTOCreateLocalization = {
        user_latitude: 0,
        user_longitude: 0,
      };

      await this.createLocalizationService.createLocalizationByUser(
        localization,
        newUser.insertedId.toString(),
      );

      //save verifytoken
      const { token } = await this.tokensService.createTokenAccount(
        newUser.insertedId.toString(),
        user.email,
      );

      //send email
      await this.emailService
        .sendVerificationEmail(user.email, token)
        .catch(async () => {
          //Error in send email, remove account
          await this.deleteAccountService.deleteAccount(
            newUser.insertedId.toString(),
          );
          throw new Error(listCodeErrors.sendEmail.code);
        });
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }
}
