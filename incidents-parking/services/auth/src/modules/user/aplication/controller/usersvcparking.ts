import { FastifyReply, FastifyRequest } from "fastify";
import ResponseFastifyAdapter from "../../../../common/adapters/responseFastifyAdapter";
import { UserSVCParkingService } from "../../domain/services/usersvcparking";

class SVCParkingController {
  constructor(
    private readonly responseAdapter = new ResponseFastifyAdapter(),
    private readonly userSVCParkingService = new UserSVCParkingService()
  ) {}

  public getUsersByCompanyId = async (
    req: FastifyRequest<{ Params: { companyId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const result = await this.userSVCParkingService.getUsersByCompanyId(
        req.params.companyId
      );
      return this.responseAdapter.successResponse(reply, result);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public getUserByParkingId = async (
    req: FastifyRequest<{ Params: { parkingId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const result = await this.userSVCParkingService.getUsersByParkingId(
        req.params.parkingId
      );
      return this.responseAdapter.successResponse(reply, result);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public getCompanyByUserId = async (
    req: FastifyRequest<{ Querystring: { userId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const result = await this.userSVCParkingService.getCompanyByUserId(
        req.query.userId
      );
      return this.responseAdapter.successResponse(reply, result);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public getParkingByUserId = async (
    req: FastifyRequest<{ Querystring: { userId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const result = await this.userSVCParkingService.getParkingByUserId(
        req.query.userId
      );
      return this.responseAdapter.successResponse(reply, result);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };
}

export default SVCParkingController;
