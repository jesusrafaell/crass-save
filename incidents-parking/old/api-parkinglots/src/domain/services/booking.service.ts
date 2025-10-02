import { FilterBooking } from "../../application/controllers/booking.controller";
import { convertBookingToResponse } from "../../common/utils/convertBookingToResponse";
import listCodeErrors from "../../common/utils/listCodeErrors";
import { BookingRepository } from "../../infrastructure/repository/bookingRepository";
import {
  Booking,
  BookingRequest,
  BookingResponse,
  BookingUpdate,
} from "../models/booking";
import { ParkingService } from "./parking.service";
import { ParkingSVCService } from "./parkingsvc.service";
import { StatusService } from "./status.service";

export class BookingService {
  constructor(
    private readonly bookingRepository = new BookingRepository(),
    private readonly statusService = new StatusService(),
    private readonly parkingSVCService = new ParkingSVCService(),
    private readonly parkingService = new ParkingService()
  ) {}

  public async getById(id: string) {
    try {
      const booking = await this.bookingRepository.getById(id);
      if (!booking) {
        throw new Error(listCodeErrors.bookingNotFound.code);
      }
      return booking;
    } catch (err) {
      throw err;
    }
  }

  public async getAll(lang: string, filter: FilterBooking) {
    try {
      const bookings = await this.bookingRepository.getAll(lang, filter);
      return bookings;
    } catch (err) {
      throw err;
    }
  }

  public async getByDriverId(driverId: string, lang: string, all?: boolean) {
    try {
      const bookings = await this.bookingRepository.getByDriverId(
        driverId,
        lang,
        all
      );
      const bookingsRes: BookingResponse[] = bookings.map((b) => {
        return convertBookingToResponse(b);
      });
      return bookingsRes;
    } catch (err) {
      throw err;
    }
  }

  public async getCountByDriverId(driveId: string) {
    try {
      const length = await this.bookingRepository.getCountByDriverId(driveId);
      return {
        length,
      };
    } catch (err) {
      throw err;
    }
  }

  public async create(b: BookingRequest) {
    try {
      //status no pagada o pendiente por pagar ? revisar
      const status = await this.statusService.getByNameEN("pending");
      if (!status) {
        throw new Error("Status not found");
      }

      //calculate price
      const price = await this.calculatePrice({
        parkingId: b.parkingId,
        serviceIds: b.serviceIds,
        hours: b.hours,
      });

      //valid info
      const booking: Booking = {
        id: "",
        licensePlate: b.licensePlate,
        lpContainer: b.lpContainer,
        description: b.description,
        initTime: b.initTime,
        endTime: b.endTime,
        hours: b.hours,
        price: price * b.hours,
        userId: b.userId,
        driverId: b.driverId || null,
        parkingId: b.parkingId,
        statusId: status.id,
        companyId: b.companyId,
        serviceIds: b.serviceIds,
        createdAt: 0,
        updatedAt: 0,
      };
      const bookings = await this.bookingRepository.create(booking);
      return bookings;
    } catch (err) {
      throw err;
    }
  }

  public async update(id: string, booking: BookingUpdate) {
    try {
      //calculate price by services now
      if (booking.serviceIds) {
        const b = await this.getById(id);
        let parkingId = b.parkingId;
        if (booking.parkingId) {
          const parking = await this.parkingService.getById(booking.parkingId);
          parkingId = parking.id;
        }
        const price = await this.calculatePrice({
          parkingId: parkingId,
          serviceIds: b.serviceIds,
          hours: b.hours,
        });
        booking.price = price * b.hours;
      }
      const bookings = await this.bookingRepository.update(id, booking);
      return bookings;
    } catch (err) {
      throw err;
    }
  }

  public async asignate(driveId: string, licensePlate: string) {
    try {
      const bookings = await this.bookingRepository.getListByLicensePlate(
        licensePlate
      );

      //TODO: validate if not booking
      if (!bookings.length) {
        // throw new Error(listCodeErrors.notHaveBooking.code);
        return [];
      }

      const filterBookings = bookings.filter((booking) => {
        if (booking.driverId) {
          if (booking.driverId !== driveId) {
            console.log("Error asignate booking", {
              bookingId: booking.id,
              driverId: booking.driverId,
              licensePlate: booking.licensePlate,
              actualDriver: driveId,
            });
            throw new Error(listCodeErrors.bookingAsigned.code);
          } else {
            return false;
          }
        }
        return true;
      });

      if (filterBookings && filterBookings.length) {
        const currentStatus = await this.statusService.getByNameEN("pending");
        for (let booking of filterBookings) {
          await this.bookingRepository.update(booking.id, {
            driverId: driveId,
            statusId: currentStatus.id,
          });
        }
      }

      return filterBookings;
    } catch (err) {
      throw err;
    }
  }

  private async calculatePrice(data: {
    parkingId: string;
    serviceIds: string[];
    hours: number;
  }): Promise<number> {
    try {
      const listServices = await this.parkingSVCService.getListByParking(
        data.parkingId,
        "en"
      );
      let price: number = 0;
      data.serviceIds.forEach((serviceID) => {
        console.log(serviceID);
        const service = listServices.find((item) => {
          return item.id === serviceID;
        });
        if (service) {
          price += service.price;
        }
      });
      price = price * data.hours;
      return price;
    } catch (err) {
      throw err;
    }
  }
}
