import { FastifyInstance } from "fastify";
import { BookingController } from "../../application/controllers/booking.controller";
import { UpdateBookingSchema } from "../../common/validator/booking/updateBooking";
import { CreateBookingSchema } from "../../common/validator/booking/createBooking";
import { AsignateBookingSchema } from "../../common/validator/booking/asignateBooking";

export class BookingRoutes {
  static routes = async (fastify: FastifyInstance) => {
    const bookingController = new BookingController();

    fastify.post(
      "/",
      { schema: CreateBookingSchema },
      bookingController.create
    );
    fastify.get("/data", bookingController.getAll); //web
    fastify.get("/drive", bookingController.getByDriveId); //mobile
    fastify.put(
      "/:id",
      { schema: UpdateBookingSchema },
      bookingController.update
    );
    fastify.post(
      "/asignate",
      { schema: AsignateBookingSchema },
      bookingController.asignate
    );
    // fastify.delete('/', bookingController.delete);
  };
}
