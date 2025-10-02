import { FastifyReply, FastifyRequest } from "fastify";
import ResponseFastifyAdapter from "../../../../common/adapters/responseFastifyAdapter";
import { VerifyTokensService } from "../../domain/services/verifyToken.service";
import { ObjectId } from "mongodb";

class VerifyTokenController {
  constructor(
    private readonly responseFastify = new ResponseFastifyAdapter(),
    private readonly verifyTokensService = new VerifyTokensService()
  ) {}

  public validForgotPassword = async (
    req: FastifyRequest<{ Body: { token: string } }>,
    res: FastifyReply
  ) => {
    try {
      const { token } = req.body;
      //valid exist
      const result = await this.verifyTokensService.getByTokenURI(
        token,
        "passwordReset"
      );
      return this.responseFastify.successResponse(res, result);
    } catch (error) {
      return this.responseFastify.errorResponse(res, error as Error);
    }
  };

  public validAccount = async (
    req: FastifyRequest<{ Body: { token: string } }>,
    res: FastifyReply
  ) => {
    try {
      const { token } = req.body;

      //valid exist
      const result = await this.verifyTokensService.getByTokenURI(
        token,
        "verifyEmail"
      );
      return this.responseFastify.successResponse(res, result);
    } catch (error) {
      return this.responseFastify.errorResponse(res, error as Error);
    }
  };

  public validDriver = async (
    req: FastifyRequest<{ Body: { token: string } }>,
    res: FastifyReply
  ) => {
    try {
      const { token } = req.body;

      //valid exist
      const result = await this.verifyTokensService.getByTokenURI(
        token,
        "driverxcompany"
      );
      return this.responseFastify.successResponse(res, result);
    } catch (error) {
      return this.responseFastify.errorResponse(res, error as Error);
    }
  };

  public createTokenPassowrd = async (
    req: FastifyRequest<{ Body: { userId: string; email: string } }>,
    res: FastifyReply
  ) => {
    try {
      const { userId, email } = req.body;
      //create
      const result = await this.verifyTokensService.createTokenPassowrd(
        userId,
        email
      );
      return this.responseFastify.successResponse(res, result);
    } catch (error) {
      return this.responseFastify.errorResponse(res, error as Error);
    }
  };

  public createTokenAccount = async (
    req: FastifyRequest<{ Body: { userId: string; email: string } }>,
    res: FastifyReply
  ) => {
    try {
      const { userId, email } = req.body;
      //create
      const result = await this.verifyTokensService.createTokenAccount(
        userId,
        email
      );
      return this.responseFastify.successResponse(res, result);
    } catch (error) {
      return this.responseFastify.errorResponse(res, error as Error);
    }
  };
  public createTokenDriver = async (
    req: FastifyRequest<{
      Body: { email: string; driverId: string; companyId: string };
    }>,
    res: FastifyReply
  ) => {
    try {
      const { email, driverId, companyId } = req.body;
      const result = await this.verifyTokensService.createTokenDriver(
        email,
        driverId,
        companyId
      );
      return this.responseFastify.successResponse(res, result);
    } catch (error) {
      return this.responseFastify.errorResponse(res, error as Error);
    }
  };

  public deleteToken = async (
    req: FastifyRequest<{ Params: { id: ObjectId } }>,
    res: FastifyReply
  ) => {
    try {
      const { id } = req.params;
      await this.verifyTokensService.delete(id);
      return this.responseFastify.successResponseMessage(res, "Token delete");
    } catch (error) {
      return this.responseFastify.errorResponse(res, error as Error);
    }
  };
}

export default VerifyTokenController;
