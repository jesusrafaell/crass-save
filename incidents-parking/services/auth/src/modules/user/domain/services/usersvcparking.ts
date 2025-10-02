import listCodeErrors from "../../../../common/utils/listCodeErrors";
import { UserXCompanyRepository } from "../../infraestructure/repository/userxcompanyRepository";
import { UserXParkingRepository } from "../../infraestructure/repository/userxparkingRepository";
import { ParkingDto } from "../models/truck/parkinglot";

export class UserSVCParkingService {
  constructor(
    private readonly userXcompany = new UserXCompanyRepository(),
    private readonly userXparking = new UserXParkingRepository()
  ) {}

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
        console.log("Error(login): User not have company:", userId);
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

  public getParkingByUserId = async (
    userId: string
  ): Promise<ParkingDto | null> => {
    try {
      const parking = await this.userXparking.getParkingByUserId(userId);
      if (!parking) {
        console.log("Error(login): User not have parking:", userId);
        throw new Error(listCodeErrors.notAccess.code);
      }
      return parking;
    } catch (err) {
      const _error = err as Error;
      throw new Error(_error.message);
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
