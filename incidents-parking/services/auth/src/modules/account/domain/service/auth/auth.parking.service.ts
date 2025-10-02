import { TokenDto } from "../../../../authToken/domain/models/token";
import { LoginParkginResponse, LoginParking } from "../../models/auth";
import { convertUserResponse } from "../../../../user/infraestructure/utils/convertUserResponse";
import listCodeErrors from "../../../../../common/utils/listCodeErrors";
import { AuthTokenService as AuthToken } from "../../../../authToken/domain/services/authToken";
import { strToRole } from "../../../../authToken/domain/models/roleToken";
import { AuthService } from "./auth.service";
import { UserSVCParkingService } from "../../../../user/domain/services/usersvcparking";
import {
  CompanyDto,
  ParkingDto,
} from "../../../../user/domain/models/truck/parkinglot";

export class AuthParkingService {
  constructor(
    private readonly authService = new AuthService(),
    private readonly userSVCParkingService = new UserSVCParkingService()
  ) {}

  //parking (parking & company)
  public login = async (login: LoginParking): Promise<LoginParkginResponse> => {
    try {
      //valid and get user
      const user = await this.authService.authByEmail(
        login.email,
        login.password
      );

      //valid rol parking
      if (user.roles) {
        let keyRol = "0";
        if (login.svc === "parking") {
          console.log("bug1");
          keyRol = "5";
        } else if (login.svc === "company") {
          keyRol = "6";
        } else {
          throw new Error(listCodeErrors.notAccess.code);
        }
        const adminRole = user.roles.some((role) => role.key === keyRol);
        if (!adminRole) throw new Error(listCodeErrors.notAccess.code);
      } else {
        throw new Error(listCodeErrors.notAccess.code);
      }

      //create logic [3312]
      let parking: ParkingDto | null = null;
      let company: CompanyDto | null = null;
      if (login.svc === "parking") {
        parking = await this.userSVCParkingService.getParkingByUserId(user.id);
      } else if (login.svc === "company") {
        company = await this.userSVCParkingService.getCompanyByUserId(user.id);
      }

      const dataToken: TokenDto = {
        id: user.id,
        email: user.email || "",
        os: "web",
        role: strToRole("parking"),
      };
      const expiresIn = 4 * 60 * 60; //4 hours

      const access_token = AuthToken.generateToken<TokenDto>(dataToken, {
        expiresIn,
      });
      return {
        user: convertUserResponse(user),
        parking,
        company,
        access_token,
      };
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  };
}
