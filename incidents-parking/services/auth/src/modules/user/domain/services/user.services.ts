import bcrypt from "bcrypt";
import { StatusService } from "../../../status/domain/services/status.service";
import { RolesRepository } from "../../infraestructure/repository/rolesRepository";
import { UserRepository } from "../../infraestructure/repository/userRepository";
import { User, UserUpdate } from "../models/user";
import { NewUserDTO } from "../../../account/domain/models/auth";
import { TransportTypeRepository } from "../../infraestructure/repository/transportTypesRepository";
import { convertUserResponse } from "../../infraestructure/utils/convertUserResponse";
import { OSRepository } from "../../infraestructure/repository/osRepository";
import listCodeErrors from "../../../../common/utils/listCodeErrors";
import { capitalizeString } from "../../../../common/utils/convertCapitalize";
import { UserTruckRepository } from "../../infraestructure/repository/userTruckRepository";
import { UserXCompanyRepository } from "../../infraestructure/repository/userxcompanyRepository";
import { UserXParkingRepository } from "../../infraestructure/repository/userxparkingRepository";
import { DriverXCompanyRepository } from "../../infraestructure/repository/driverxcompanyRepository";
import { HeadersDto } from "../../../../common/headers/interface";
import { CompanyDto } from "../models/truck/parkinglot";
import { SessionService } from "../../../session/domain/services/session.service";
import { VerifyTokensService } from "../../../verifyToken/domain/services/verifyToken.service";
import VerificationEmailService from "../../../email/domain/services/verificationEmail.service";

export class UserService {
  constructor(
    private readonly userRepository = new UserRepository(),
    private readonly userXcompany = new UserXCompanyRepository(),
    private readonly userXparking = new UserXParkingRepository(),
    private readonly statusService = new StatusService(),
    private readonly driverXcompanyRepository = new DriverXCompanyRepository(),
    private readonly rolesRepository = new RolesRepository(),
    private readonly osRepository = new OSRepository(),
    private readonly transportTypesRepository = new TransportTypeRepository(),
    private readonly userTruckRepository = new UserTruckRepository(),
    private readonly sessionService = new SessionService(),
    private readonly verifyTokenService = new VerifyTokensService(),
    private readonly emailService = new VerificationEmailService()
  ) {}

  public create = async (user: NewUserDTO) => {
    try {
      if (!user.guest) {
        const validEmail = await this.userRepository.getByEmail(user.email!);
        if (validEmail) throw Error(listCodeErrors.emailExist.code);
        const validMobile = await this.userRepository.getByMobile(user.mobile!);
        if (validMobile) throw new Error(listCodeErrors.mobileExist.code);
        // encript password
        const salt: string = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }

      const status = await this.statusService.getByName(
        user.guest ? "active" : "pending"
      );
      const rol = await this.rolesRepository.getByName(
        user.guest ? "guest" : "user"
      );
      const transportType = await this.transportTypesRepository.getByKey(1);

      const newUser: User = {
        id: "",
        first_name:
          user.first_name.length > 0 ? capitalizeString(user.first_name) : "",
        last_name:
          user.last_name.length > 0 ? capitalizeString(user.last_name) : "",
        email: user.email ? user.email.trim().toLowerCase() : null,
        password: user.password,
        mobile: user.mobile,
        id_status: status.id,
        status: {
          id: status.id,
          name: status.en,
        },
        id_os: null,
        os: null,
        id_transport_type: transportType?.id || "",
        transportType: transportType || undefined,
        fcm_token: null,
        id_roles: [rol!.id],
        roles: [rol!],
        utc: user.utc,
        guest: user.guest || false,
        id_auth_identification: "",
        distance_radius: 1,
        created_time: 0,
        updated_time: 0,
      };

      if (user.os) {
        const os = await this.osRepository.getByName(user.os);
        newUser.id_os = os?.id || null;
      }

      const result = await this.userRepository.create(newUser);

      newUser.id = result.id;

      return newUser;
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public getUser = async (userId: string, roleKey: string) => {
    try {
      const user = await this.userRepository.getDataById(userId);
      if (!user) {
        throw new Error(listCodeErrors.userNotFound.code);
      }

      const userRes = convertUserResponse(user);

      //truck
      if (roleKey === "truck") {
        const trucker = await this.userTruckRepository.getByUserId(user.id);
        if (trucker) {
          const truck = {
            licensePlate: trucker.licensePlate,
            company: "Nombre de la compania", // truck.company,
          };
          return {
            ...userRes,
            truck,
          };
        } else {
          throw new Error("truck not found");
        }
      }

      return userRes;
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public getById = async (userId: string) => {
    try {
      const result = await this.userRepository.getById(userId);
      if (!result) {
        throw new Error(listCodeErrors.userNotFound.code);
      }

      return result;
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public getByLicensePlate = async (licensePlate: string) => {
    try {
      const result =
        await this.userTruckRepository.getByLicensePlate(licensePlate);

      if (!result) throw new Error(listCodeErrors.userNotFound.code);

      return { userId: result.userId, licensePlate: result.licensePlate };
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public getAll = async () => {
    try {
      return await this.userRepository.getAll();
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public updateFCMToken = async (fcm_token: string, userId: string) => {
    try {
      //if other user have de fcm token remove and check session
      const preUserFCM = await this.userRepository.getByFCM(fcm_token);
      if (preUserFCM && preUserFCM.id !== userId) {
        await Promise.all([
          this.updateUser({
            id: preUserFCM.id,
            fcm_token: "",
            status: "inactive",
          }),
          this.sessionService.delete(preUserFCM.id),
        ]).catch((err) => {
          console.log(err);
        });
        console.log("fcm_token session closed ->:", preUserFCM.id);
      }

      const result = await this.updateUser({
        id: userId,
        fcm_token: fcm_token,
      });

      return result;
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public updateUser = async (user: UserUpdate) => {
    try {
      if (user.transportTypeKey) {
        const ttype = await this.transportTypesRepository.getByKey(
          user.transportTypeKey
        );
        if (ttype) {
          user.id_transport_type = ttype.id;
        }
      }

      if (user.os) {
        const os = await this.osRepository.getByName(user.os);
        if (os) {
          user.id_os = os.id;
        }
      }

      if (user.status) {
        const status = await this.statusService.getByName(user.status);
        user.id_status = status.id;
      }

      await this.userRepository.updateUser(user);
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public async deleteDataUser(userId: string) {
    try {
      const status = await this.statusService.getByName("Inactive");

      await this.userRepository.deleteDataUser(userId, status.id);
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async delete(userId: string) {
    try {
      await this.userRepository.delete(userId);
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public getByEmail = async (email: string) => {
    try {
      const user = await this.userRepository.getByEmail(email);
      if (!user) {
        throw new Error(listCodeErrors.userNotFound.code);
      }

      return user;
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public getByIds = async (userIds: string[]): Promise<User[] | []> => {
    try {
      const result = await this.userRepository.getaByIds(userIds);
      if (!result) {
        throw new Error(listCodeErrors.userNotFound.code);
      }

      return result;
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public getUsersByCompanyId = async (companyId: string) => {
    try {
      return await this.userXcompany.getUsersByCompanyId(companyId);
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public getCompanyByUserId = async (userId: string) => {
    try {
      const company = await this.userXcompany.getCompanyByUserId(userId);
      if (!company) {
        throw new Error(listCodeErrors.notAccess.code);
      }
      return company;
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public getUsersByParkingId = async (companyId: string) => {
    try {
      return await this.userXparking.getUsersByParkingId(companyId);
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public getParkingByUserId = async (userId: string) => {
    try {
      const parking = await this.userXparking.getParkingByUserId(userId);
      if (!parking) {
        throw new Error(listCodeErrors.notAccess.code);
      }
      return parking;
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
    }
  };

  public getTruckersByCompanyId = async (companyId: string) => {
    try {
      const users =
        await this.driverXcompanyRepository.getDriversByCompanyId(companyId);
      return users;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  public addTruck = async (lang: string, email: string, companyId: string) => {
    try {
      const user = await this.userRepository.getByEmail(email);

      if (!user) throw new Error(listCodeErrors.userNotFound.code);

      const hasDriverXCompany = await this.driverXcompanyRepository.getByIds({
        driverId: user.id,
        companyId,
      });

      if (hasDriverXCompany)
        throw Error(listCodeErrors.driverAlreadyExist.code);

      const [{ token }, companyName] = await Promise.all([
        this.verifyTokenService.createTokenDriver(email, user.id, companyId),
        this.driverXcompanyRepository.getNameCompanyByCompanyId(companyId),
      ]);

      await this.emailService.sendVerificationTrucker(
        email,
        token,
        lang,
        companyName,
        user.first_name + " " + user.last_name
      );

      return token;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  public verifyTruck = async (token: string) => {
    try {
      const verify = await this.verifyTokenService.getByTokenURI(
        token,
        "driverxcompany"
      );

      if (!verify.userId) new Error(listCodeErrors.userNotFound.code);

      const role = await this.rolesRepository.getByName("truck");

      if (!role) throw new Error(listCodeErrors.roleNotFound.code);

      await Promise.all([
        this.userRepository.addRole(verify.userId, role.id),
        this.driverXcompanyRepository.add({
          driverId: verify.userId,
          companyId: verify.companyId as string,
        }),
      ]);

      await this.verifyTokenService.delete(verify._id);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  //   private getBySVCParkig = async (
  //     id: string,
  //     path: string,
  //     headers: HeadersDto
  //   ) => {
  //     try {
  //       const response = await fetch(`${this.urlParking}/${path}/${id}`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-user-id": headers.userId,
  //           "x-role": `${headers.role}`,
  //         },
  //       });

  //       const data = await response.json();
  //       return data.data;
  //     } catch (error) {
  //       console.error("Error:", error);
  //       throw error;
  //     }
  //   };
}
