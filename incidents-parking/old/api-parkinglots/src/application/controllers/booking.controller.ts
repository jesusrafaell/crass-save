import { FastifyReply, FastifyRequest } from "fastify";
import ResponseFastifyAdapter from "../../common/adapters/responseFastifyAdapter";
import { BookingService } from "../../domain/services/booking.service";
import { BookingRequest, BookingUpdate } from "../../domain/models/booking";
import { removeAllListeners } from "process";

export interface FilterBooking {
  licensePlate?: string;
  userId?: string;
  parkingId?: string;
  companyId?: string;
  driverId?: string;
  all?: boolean;
}

export class BookingController {
  constructor(
    private readonly responseAdapter = new ResponseFastifyAdapter(),
    private readonly bookingService = new BookingService()
  ) {}

  public getAll = async (
    req: FastifyRequest<{ Querystring: FilterBooking }>,
    reply: FastifyReply
  ) => {
    try {
      const lang = req.headers["lang"] as string;
      const booking = await this.bookingService.getAll(lang, req.query);
      return this.responseAdapter.successResponse(reply, booking);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public getByDriveId = async (
    req: FastifyRequest<{ Querystring: { length?: boolean; all?: boolean } }>,
    reply: FastifyReply
  ) => {
    try {
      const lang = req.headers["lang"] as string;
      const driverId = req.headers["userId"] as string;
      const { length, all } = req.query;
      if (length) {
        const res = await this.bookingService.getCountByDriverId(driverId);
        return this.responseAdapter.successResponse(reply, res);
      } else {
        const booking = await this.bookingService.getByDriverId(
          driverId,
          lang,
          all
        );
        return this.responseAdapter.successResponse(reply, booking);
      }
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public create = async (
    req: FastifyRequest<{ Body: BookingRequest }>,
    reply: FastifyReply
  ) => {
    try {
      const userID = req.headers["userId"] as string;
      req.body.userId = userID;
      await this.bookingService.create(req.body);
      return this.responseAdapter.successCreatedResponse(reply);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };
  public update = async (
    req: FastifyRequest<{ Params: { id: string }; Body: BookingUpdate }>,
    reply: FastifyReply
  ) => {
    try {
      const id = req.params.id;
      await this.bookingService.update(id, req.body);
      return this.responseAdapter.successResponseMessage(
        reply,
        "booking udpated"
      );
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public asignate = async (
    req: FastifyRequest<{ Body: { driverId: string; licensePlate: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { driverId, licensePlate } = req.body;
      const result = await this.bookingService.asignate(driverId, licensePlate);
      return this.responseAdapter.successResponse(reply, {
        total: result.length,
      });
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };
}
