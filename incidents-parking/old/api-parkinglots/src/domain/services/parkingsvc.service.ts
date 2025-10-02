import { ServicesRepository } from "../../infrastructure/repository/servicesRepository";

export class ParkingSVCService {
  constructor(private readonly servicesRepository = new ServicesRepository()) {}

  public async getAll(lang: string) {
    try {
      const services = await this.servicesRepository.getAll(lang);
      return services;
    } catch (err) {
      throw err;
    }
  }

  public async getListByParking(parkingId: string, lang: string) {
    try {
      const services = await this.servicesRepository.getByParkingId(
        parkingId,
        lang
      );
      return services;
    } catch (err) {
      throw err;
    }
  }
}
