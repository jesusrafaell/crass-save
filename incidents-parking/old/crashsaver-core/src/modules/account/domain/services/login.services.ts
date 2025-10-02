import bcrypt from "bcrypt";
import { LoginTruck, UserDB } from "../../../user/domain/model/user";
import { AuthToken } from "../../../../common/middlewares/authToken";
import { DtoToken, SOType } from "../../../verifyToken/domain/model/token";
import { SchemaValidatorAdapter } from "../../../../common/adapters/schemaValidatorAdapter";
import { LoginSchema } from "../../../user/domain/model/userSchema";
import { GetUserService } from "../../../user/domain/services/getUser.service";
import listCodeErrors from "../../../../common/middlewares/listCodeErrors";
import { UpdateUserService } from "../../../user/domain/services/udpateUser.service";
import { GetLocalizationService } from "../../../localization/domain/services/getLocalization.service";
const MUUID = require('uuid-mongodb');

interface UserLogin extends Omit<UserDB, "password"> {}

interface UserLoginFail extends Omit<UserDB, "password" |"transport_type"> {
  udpated_time: number;
}

interface UserLocalization {
  latitude: number;
  longitude: number;
}

export class LoginService {
  constructor(
    private readonly authToken = new AuthToken(),
    private readonly getUserService = new GetUserService(),
    private readonly schemaValidatorAdapter = new SchemaValidatorAdapter(),
    private readonly updateUserService = new UpdateUserService(),
    private readonly getLocalizationService = new GetLocalizationService(),
  ) {}

  public async login(
    email: string,
    password: string,
    so: SOType,
  ): Promise<{
    user: UserLoginFail;
    transport: {
      type: number;
    }
    localization: UserLocalization;
    access_token: string;
  }> {
    try {
      this.schemaValidatorAdapter.compileSchema(LoginSchema);
      this.schemaValidatorAdapter.verifySchema({ email, password, so });

      //valid and get user
      const user = await this.getUserService.getUserByEmail(email);

      //valid passsword
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error(listCodeErrors.userNotFound.code);
      }

      const dataToken: DtoToken = {
        _id: user._id!.toString(),
        id: user.id,
        email: user.email,
        so,
      };

      if (user.status === "new") {
        throw new Error(listCodeErrors.unverifiedAccount.code);
      } else if (user.status === "locked") {
        throw new Error(listCodeErrors.userLocked.code);
      }
      //active status
      await this.updateUserService.updateUser(user._id.toString(), {
        status: "activo",
      });
      user.status = "activo";

      //get lastlocation
      const lastLocation =
        await this.getLocalizationService.getLocalizationUser(
          user._id.toString(),
        );

      if (!lastLocation) {
        throw new Error(listCodeErrors.localizationNotFound.code);
      }

      const access_token = this.authToken.generateToken(dataToken);
      const { password: pass, transport_type ,...userData } = user;
      return {
        user: {
          ...userData,
          udpated_time: userData.updated_time,
        },
        transport: {
          type: transport_type || 0,
        },
        localization: {
          longitude:
            lastLocation.location?.coordinates[0] ||
            lastLocation.user_longitude,
          latitude:
            lastLocation.location?.coordinates[1] || lastLocation.user_latitude,
        },
        access_token,
      };
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async loginManager(
    email: string,
    password: string,
    so: SOType,
  ): Promise<{
    user: UserLogin;
    access_token: string;
  }> {
    try {
      this.schemaValidatorAdapter.compileSchema(LoginSchema);
      this.schemaValidatorAdapter.verifySchema({ email, password, so });

      //valid and get user
      const user = await this.getUserService.getUserByEmail(email);

      //valid passsword
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error(listCodeErrors.userNotFound.code);
      }

      const dataToken: DtoToken = {
        _id: user._id!.toString(),
        id: user.id,
        email: user.email,
        so,
      };

      //valid status
      if (user.status === "new") {
        throw new Error(listCodeErrors.unverifiedAccount.code);
      } else if (user.status === "locked") {
        throw new Error(listCodeErrors.userLocked.code);
      }

      //valid role
      if (!user.role || user.role.key !== 2) {
        //no autorization
        throw new Error(listCodeErrors.notAccess.code);
      }

      const expiresIn = 4 * 60 * 60; //4 hours

      const access_token = this.authToken.generateToken(dataToken, expiresIn);
      const { password: pass, ...userData } = user;
      return {
        user: userData,
        access_token,
      };
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async loginTruck(
    truck: LoginTruck
  ): Promise<{
    user: UserLoginFail;
    transport: {
      type: number;
    }
    localization: UserLocalization;
    access_token: string;
  }> {
    try {
      this.schemaValidatorAdapter.compileSchema(LoginSchema);
      this.schemaValidatorAdapter.verifySchema({ email: truck.email, password: truck.password, so: truck.so });

      //valid and get user
      const user = await this.getUserService.getUserByEmail(truck.email);

      //valid passsword
      const isPasswordValid = await bcrypt.compare(truck.password, user.password);

      if (!isPasswordValid) {
        throw new Error(listCodeErrors.userNotFound.code);
      }

      const dataToken: DtoToken = {
        _id: user._id!.toString(),
        id: user.id,
        email: user.email,
        so: truck.so,
      };

      if (user.status === "new") {
        throw new Error(listCodeErrors.unverifiedAccount.code);
      } else if (user.status === "locked") {
        throw new Error(listCodeErrors.userLocked.code);
      }
      if (user.role.name !== "truck") {
        //it's not truck drive
        throw new Error(listCodeErrors.notAccess.code);
      }
      //active status
      await this.updateUserService.updateUser(user._id.toString(), {
        status: "activo",
      },
        {
          userId: user.id,
          licensePlate: truck.licensePlate,
      }
      );
      user.status = "activo";

      //get lastlocation
      const lastLocation =
        await this.getLocalizationService.getLocalizationUser(
          user._id.toString(),
        );

      if (!lastLocation) {
        throw new Error(listCodeErrors.localizationNotFound.code);
      }


      const access_token = this.authToken.generateToken(dataToken);
      const { password: pass, transport_type ,...userData } = user;
      return {
        user: {
          ...userData,
          udpated_time: userData.updated_time,
        },
        transport: {
          type: transport_type || 0,
        },
        localization: {
          longitude:
            lastLocation.location?.coordinates[0] ||
            lastLocation.user_longitude,
          latitude:
            lastLocation.location?.coordinates[1] || lastLocation.user_latitude,
        },
        access_token,
      };
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }
}
