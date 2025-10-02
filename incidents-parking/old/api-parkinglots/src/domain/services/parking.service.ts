import listCodeErrors from "../../common/utils/listCodeErrors";
import { ParkingRepository } from "../../infrastructure/repository/parkingRepository";
import { Parking } from "../models/parking";

export class ParkingService {
  constructor(private readonly parkingRepository = new ParkingRepository()) {}

  public async getAll() {
    try {
      const parkings = await this.parkingRepository.getAll();
      return parkings;
    } catch (err) {
      throw err;
    }
  }

  public async getById(id: string) {
    try {
      const parking = await this.parkingRepository.getById(id);
      if (!parking) {
        throw new Error(listCodeErrors.parkingNotFound.code);
      }
      return parking;
    } catch (err) {
      throw err;
    }
  }

  public async create(parking: Parking) {
    try {
      await this.parkingRepository.create(parking);
    } catch (err) {
      throw err;
    }
  }
}
