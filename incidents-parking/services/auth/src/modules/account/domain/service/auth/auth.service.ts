import bcrypt from "bcrypt";
import { OS, TokenDto } from "../../../../authToken/domain/models/token";
import { Login, LoginResponse, NewUserDTO } from "../../models/auth";
import { UserService } from "../../../../user/domain/services/user.services";
import { LocationService } from "../../../../location/domain/services/location.service";
import { convertUserResponse } from "../../../../user/infraestructure/utils/convertUserResponse";
import { StatusService } from "../../../../status/domain/services/status.service";
import listCodeErrors from "../../../../../common/utils/listCodeErrors";
import { UserTruckRepository } from "../../../../user/infraestructure/repository/userTruckRepository";
import { AuthTokenService as AuthToken } from "../../../../authToken/domain/services/authToken";
import { SessionService } from "../../../../session/domain/services/session.service";
import { strToRole } from "../../../../authToken/domain/models/roleToken";
import { User } from "../../../../user/domain/models/user";

export class AuthService {
  constructor(
    private readonly userService = new UserService(),
    private readonly locationService = new LocationService(),
    private readonly statusService = new StatusService(),
    private readonly sessionService = new SessionService(),
    private readonly userTruckRepository = new UserTruckRepository()
  ) {}

  //normal user
  public loginMobile = async (login: Login): Promise<LoginResponse> => {
    try {
      const user = await this.authByEmail(login.email, login.password);

      const dataToken: TokenDto = {
        id: user.id,
        email: user.email as string,
        os: login.so,
        role: strToRole("user"),
      };

      const access_token = AuthToken.generateToken<TokenDto>(dataToken);

      //location, change status, session
      const [location] = await Promise.all([
        await this.locationService.getByUserId(user.id),
        await this.userService.updateUser({
          id: user.id,
          status: "active",
          os: login.so,
        }),
        await this.sessionService.createOrUpdate({
          userId: user.id,
          token: access_token,
        }),
      ]);

      return {
        user: convertUserResponse(user),
        transport: {
          type: user.transportType?.key || 0,
        },
        localization: {
          latitude: location.location.coordinates[1],
          longitude: location.location.coordinates[0],
        },
        access_token,
      };
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public loginGuest = async (utc: string, os: OS): Promise<LoginResponse> => {
    try {
      //create user guest
      const newUser: NewUserDTO = {
        first_name: "Invitado",
        last_name: "Guest",
        email: null,
        password: "",
        mobile: null,
        utc,
        os,
        guest: true,
      };

      const user = await this.userService.create(newUser);

      //create location guest
      const location = await this.locationService.create(
        { userLatitude: 0, userLongitude: 0 },
        user.id
      );

      const dataToken: TokenDto = {
        id: user.id,
        email: user.email || "",
        os: "web",
        role: strToRole("guest"),
      };

      const access_token = AuthToken.generateToken<TokenDto>(dataToken);

      return {
        user: convertUserResponse(user),
        transport: {
          type: user.transportType?.key || 0,
        },
        localization: {
          latitude: location.location.coordinates[1],
          longitude: location.location.coordinates[0],
        },
        access_token,
      };
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  //mobile
  public async logout(user_id: string, roleKey: string) {
    try {
      //get User
      const user = await this.userService.getById(user_id);

      if (user.guest) {
        //guest remove account
        await Promise.all([
          this.userService.delete(user_id),
          this.locationService.delete(user_id),
        ]);
      } else {
        if (roleKey === "truck") {
          this.userTruckRepository.deleteByUserId(user.id).catch((err) => {
            console.log({ name: "userTruckRepository, deleteByUserId", err });
          });
        }

        const statusInactive = await this.statusService.getByName("inactive");
        await Promise.all([
          this.userService.updateUser({
            id: user.id,
            id_status: statusInactive.id,
            fcm_token: "",
          }),

          this.sessionService.delete(user.id),
        ]);
      }
    } catch (error) {
      console.log(error);
      const _error = error as Error;
      throw new Error(_error.message);
    }
  }

  //superadmin
  public loginManager = async (login: Login): Promise<LoginResponse> => {
    try {
      const user = await this.authByEmail(login.email, login.password);
      //valid rol
      if (user.roles) {
        const adminRole = user.roles.some((role) => role.key === "2");
        if (!adminRole) throw new Error(listCodeErrors.notAccess.code);
      } else {
        throw new Error(listCodeErrors.notAccess.code);
      }

      const dataToken: TokenDto = {
        id: user.id,
        email: user.email || "",
        os: "web",
        role: strToRole("admin"),
      };

      const expiresIn = 4 * 60 * 60; //4 hours

      const access_token = AuthToken.generateToken<TokenDto>(dataToken, {
        expiresIn,
      });
      return {
        user: convertUserResponse(user),
        access_token,
      };
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  };

  public async authByEmail(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.getByEmail(email);

      //valid passsword
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error(listCodeErrors.userNotFound.code);
      }

      //valid status
      if (user.status) {
        if (user.status.name === "pending") {
          throw new Error(listCodeErrors.unverifiedAccount.code);
        } else if (user.status.name === "userSuspended") {
          throw new Error(listCodeErrors.userSuspended.code);
        }
      } else {
        throw new Error(listCodeErrors.unverifiedAccount.code);
      }

      return user;
    } catch (err) {
      throw err;
    }
  }
}
