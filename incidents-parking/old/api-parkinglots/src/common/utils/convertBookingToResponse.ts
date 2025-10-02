import { Booking, BookingResponse } from "../../domain/models/booking";

export const convertBookingToResponse = (b: Booking): BookingResponse => {
  const booking: BookingResponse = {
    id: b.id,
    licensePlate: b.licensePlate,
    lpContainer: b.lpContainer,
    description: b.description,
    initTime: b.initTime,
    endTime: b.endTime,
    hours: b.hours,
    price: b.price,
    userId: b.userId,
    driverId: b.driverId || null,
    parking: b.parking || null,
    company: b.company || null,
    status: b.status || null,
    services: b.services || [],
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };

  return booking;
};
