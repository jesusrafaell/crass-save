import { TokenDto } from "../../../../authToken/domain/models/token";
import { LoginResponse, LoginTruck } from "../../models/auth";
import { UserService } from "../../../../user/domain/services/user.services";
import { LocationService } from "../../../../location/domain/services/location.service";
import { convertUserResponse } from "../../../../user/infraestructure/utils/convertUserResponse";
import listCodeErrors from "../../../../../common/utils/listCodeErrors";
import { UserTruckRepository } from "../../../../user/infraestructure/repository/userTruckRepository";
import { ObjectId } from "mongodb";
import { nativeCurrentUnixTime } from "../../../../../common/utils/unixTime";
import { AuthTokenService as AuthToken } from "../../../../authToken/domain/services/authToken";
import { SessionService } from "../../../../session/domain/services/session.service";
import { strToRole } from "../../../../authToken/domain/models/roleToken";
import { AssignBookingRequest } from "../../models/login";
import { HeadersDto } from "../../../../../common/headers/interface";
import { AuthService } from "./auth.service";

export class AuthTruckService {
  private urlParking = process.env.API_PARKING as string;

  constructor(
    private readonly authService = new AuthService(),
    private readonly userService = new UserService(),
    private readonly locationService = new LocationService(),
    private readonly sessionService = new SessionService(),
    private readonly userTruckRepository = new UserTruckRepository()
  ) {}

  public login = async (login: LoginTruck): Promise<LoginResponse> => {
    try {
      //truck logic
      const user = await this.authService.authByEmail(
        login.email,
        login.password
      );

      const dataToken: TokenDto = {
        id: user.id,
        email: user.email as string,
        os: login.so,
        role: strToRole("truck"),
      };

      if (login.licensePlate.length < 4) {
        throw new Error("licensePlate invalid");
      }
      if (user.roles) {
        const truckRole = user.roles.some((role) => role.key === "4");
        if (!truckRole) throw new Error(listCodeErrors.notAccess.code);
      } else {
        throw new Error(listCodeErrors.notAccess.code);
      }
      //valid licensePlate
      const validLicensePlate =
        await this.userTruckRepository.getByLicensePlate(login.licensePlate);
      if (validLicensePlate) {
        if (validLicensePlate.userId !== user.id) {
          throw new Error("licensePlate in use");
        }
      } else {
        await this.userTruckRepository.createOrUpdate({
          _id: new ObjectId(),
          userId: user.id,
          licensePlate: login.licensePlate,
          company: "",
          updatedAt: nativeCurrentUnixTime(),
        });
        //asigned booking
        await this.asignateBooking(
          {
            driverId: user.id,
            licensePlate: login.licensePlate,
          },
          { userId: user.id, role: dataToken.role }
        );
      }
      const access_token = AuthToken.generateToken<TokenDto>(dataToken);

      //location, change status, session
      const [location] = await Promise.all([
        this.locationService.getByUserId(user.id),
        this.userService.updateUser({
          id: user.id,
          status: "active",
          os: login.so,
        }),
        this.sessionService.createOrUpdate({
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

  private asignateBooking = async (
    request: AssignBookingRequest,
    headers: HeadersDto
  ): Promise<number> => {
    const requestBody: AssignBookingRequest = {
      driverId: request.driverId,
      licensePlate: request.licensePlate,
    };

    try {
      const response = await fetch(`${this.urlParking}/booking/asignate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": headers.userId,
          "x-role": `${headers.role}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      return 0;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
}
