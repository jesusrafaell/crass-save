import bcrypt from "bcrypt";
import ForgotPasswordEmailService from "../../../email/domain/services/forgotPasswordEmail.service";
import { NewUserDTO } from "../models/auth";
import { UserService } from "../../../user/domain/services/user.services";
import { LocationService } from "../../../location/domain/services/location.service";
import { VerifyTokensService } from "../../../verifyToken/domain/services/verifyToken.service";
import VerificationEmailService from "../../../email/domain/services/verificationEmail.service";
import listCodeErrors from "../../../../common/utils/listCodeErrors";
import { UserUpdate } from "../../../user/domain/models/user";

class AccountService {
  constructor(
    private readonly userService = new UserService(),
    private readonly locationService = new LocationService(),
    private readonly verifyTokensService = new VerifyTokensService(),
    private readonly forgotPasswordEmailService = new ForgotPasswordEmailService(),
    private readonly verificationEmailService = new VerificationEmailService()
  ) {}

  public async create(newUser: NewUserDTO) {
    try {
      //create User
      const user = await this.userService.create(newUser);

      //create Location
      const userLocation = await this.locationService.create(
        { userLatitude: 0, userLongitude: 0 },
        user.id
      );

      //create VerifyToken (User)
      if (!user.guest && user.email) {
        const verifyToken = await this.verifyTokensService.createTokenAccount(
          user.id,
          user.email
        );

        //send email
        // if (process.env.ENV !== "local") {
        await this.verificationEmailService.sendVerificationEmail(
          user.email,
          verifyToken.token
        );
        // }
      }
      return { user, userLocation };
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async changePassword(newPassword: string, userId: string) {
    try {
      const salt: string = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(newPassword, salt);

      await this.userService.updateUser({
        id: userId,
        password,
      });
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async recoverAccountByEmail(email: string) {
    try {
      //valid user / get user
      const user = await this.userService.getByEmail(email);

      if (!user) {
        throw new Error(listCodeErrors.userNotFound.code);
      }

      //generate token
      const { token } = await this.verifyTokensService.createTokenPassowrd(
        user.id,
        email
      );
      console.log(token);
      // send email
      await this.forgotPasswordEmailService.sendMailFogotPassword(
        user.email as string,
        token
      );
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async changePasswordByRecover(password: string, token: string) {
    try {
      //valid exist token db
      const verifyToken = await this.verifyTokensService.getByTokenURI(
        token,
        "passwordReset"
      );

      //valid exist user
      const { userId } = verifyToken;

      const user = await this.userService.getById(userId);

      if (!user) throw new Error(listCodeErrors.userNotFound.code);

      //update status user
      await this.changePassword(password, userId);

      await this.verifyTokensService.delete(verifyToken._id);
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async verifyToken(email: string) {
    try {
      //valid user / get user
      const user = await this.userService.getByEmail(email);

      if (!user) {
        throw new Error(listCodeErrors.userNotFound.code);
      }

      //generate token
      // const token = "crear un token en verify"
      const { token } = await this.verifyTokensService.createTokenPassowrd(
        user.id,
        email
      );
      // send email
      await this.forgotPasswordEmailService.sendMailFogotPassword(
        user.email as string,
        token
      );
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async verifyAccount(token: string) {
    try {
      //valid exist token db
      const verifyToken = await this.verifyTokensService.getByTokenURI(
        token,
        "verifyEmail"
      );

      const { userId } = verifyToken;

      const user = await this.userService.getById(userId);

      if (!user) throw new Error(listCodeErrors.userNotFound.code);

      const data: UserUpdate = {
        id: userId,
        status: "inactive",
      };

      await this.userService.updateUser(data);

      //delete token
      await this.verifyTokensService.delete(verifyToken._id);
      return { email: user.email };
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async updateTransportType(userId: string, transportTypeKey: number) {
    try {
      await this.userService.getById(userId);

      await this.userService.updateUser({
        id: userId,
        transportTypeKey,
      });
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async delete(userId: string) {
    try {
      const user = await this.userService.getById(userId);

      //delete user
      if (user.guest) {
        //delete complete
        await this.userService.delete(userId);
      } else {
        //delete
        await this.userService.deleteDataUser(userId);
      }

      //delete location
      await this.locationService.delete(userId);
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }
}

export default AccountService;
