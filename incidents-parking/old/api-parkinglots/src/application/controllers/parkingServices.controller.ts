import { FastifyReply, FastifyRequest } from "fastify";
import ResponseFastifyAdapter from "../../common/adapters/responseFastifyAdapter";
import { ParkingService } from "../../domain/services/parking.service";
import { ParkingSVCService } from "../../domain/services/parkingsvc.service";

export class ParkingServicesController {
  constructor(
    private readonly responseAdapter = new ResponseFastifyAdapter(),
    private readonly parkingSVCService = new ParkingSVCService()
  ) {}

  public getAll = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const lang = req.headers["lang"] as string;
      const parkings = await this.parkingSVCService.getAll(lang);
      return this.responseAdapter.successResponse(reply, parkings);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public getByParking = async (
    req: FastifyRequest<{ Params: { parkingId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const parkingId = req.params.parkingId;
      const lang = req.headers["lang"] as string;
      const services = await this.parkingSVCService.getListByParking(
        lang,
        parkingId
      );
      return this.responseAdapter.successResponse(reply, services);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };
}
