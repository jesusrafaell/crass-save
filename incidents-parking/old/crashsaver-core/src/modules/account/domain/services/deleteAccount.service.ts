import { GetLocalizationService } from "../../../localization/domain/services/getLocalization.service";
import { DeleteLocalizationService } from "../../../localization/domain/services/deleteLocalization.service";
import { DeleteUserService } from "../../../user/domain/services/deleteUser.service";
import { GetUserService } from "../../../user/domain/services/getUser.service";

export class DeleteAccountService {
  constructor(
    private readonly getUserService = new GetUserService(),
    private readonly deleteUserService = new DeleteUserService(),
    private readonly getLocalizationService = new GetLocalizationService(),
    private readonly deleteLocalizationService = new DeleteLocalizationService(),
  ) {}

  public async deleteAccount(user_id: string) {
    try {
      //get User
      const { user } = await this.getUserService.getUserById(user_id);

      //get
      const localization =
        await this.getLocalizationService.getLocalizationByUserId(
          user._id.toString(),
        );

      //delete user location
      await this.deleteLocalizationService.deleteLocalization(
        localization._id.toString(),
      );

      //delete  user info
      await this.deleteUserService.deleteUser(user_id);
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }
}
