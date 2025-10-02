import {
  GuestDto,
  RegisterUser,
  UserDB,
} from "../../../user/domain/model/user";
import { AuthToken } from "../../../../common/middlewares/authToken";
import { DtoToken } from "../../../verifyToken/domain/model/token";
import { GetUserService } from "../../../user/domain/services/getUser.service";
import { CreateUserService } from "../../../user/domain/services/createUser.service";
import { CreateLocalizationService } from "../../../localization/domain/services/createLocalization.service";

interface UserLogin extends Omit<UserDB, "password"> {}

interface UserLoginFail extends Omit<UserDB, "password"> {
  udpated_time: number;
}

interface UserLocalization {
  latitude: number;
  longitude: number;
}

export class LoginGuestService {
  constructor(
    private readonly createUserService = new CreateUserService(),
    private readonly getUserService = new GetUserService(),
    private readonly createLocalizationService = new CreateLocalizationService(),
    private readonly authToken = new AuthToken(),
  ) {}

  public async login(guest: GuestDto): Promise<{
    user: UserLoginFail;
    localization: UserLocalization;
    access_token: string;
  }> {
    try {
      const newQuest: RegisterUser = {
        first_name: "Invitado",
        last_name: "(Guest)",
        email: "",
        password: "",
        mobile: "",
        utc: guest.utc,
        quest: true,
      };
      const newUser = await this.createUserService.createUser(newQuest);

      await this.createLocalizationService.createLocalizationByUser(
        {
          user_latitude: 0,
          user_longitude: 0,
        },
        newUser.insertedId.toString(),
      );

      const { user } = await this.getUserService.getUserById(
        newUser.insertedId.toString(),
      );
      const dataToken: DtoToken = {
        _id: user._id!.toString(),
        id: user.id,
        email: user.email,
        so: guest.so,
      };
      const access_token = this.authToken.generateToken(dataToken);
      const { password: pass, ...userData } = user;
      return {
        user: {
          ...userData,
          udpated_time: userData.updated_time,
        },
        localization: {
          longitude: 0,
          latitude: 0,
        },
        access_token,
      };
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }
}
