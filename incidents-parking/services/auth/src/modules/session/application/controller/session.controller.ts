import { SessionService } from "../../domain/services/session.service";
import ResponseFastifyAdapter from "../../../../common/adapters/responseFastifyAdapter";
import { FastifyReply, FastifyRequest } from "fastify";
import { SessionPayload } from "../../domain/model";

class SessionController {
  constructor(
    private readonly responseFastify = new ResponseFastifyAdapter(),
    private readonly sessionService = new SessionService()
  ) {}

  public createOrUpdate = async (
    req: FastifyRequest<{ Body: SessionPayload }>,
    reply: FastifyReply
  ) => {
    try {
      const result = await this.sessionService.createOrUpdate(
        req.body as SessionPayload
      );
      return this.responseFastify.successResponse(reply, result);
    } catch (error) {
      return this.responseFastify.errorResponse(reply, error as Error);
    }
  };

  public verify = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = req.headers["authorization"] as string;
      const headerToken = authHeader && authHeader.split(" ")[1];

      const result = await this.sessionService.verify(headerToken);

      return this.responseFastify.successResponse(reply, result);
    } catch (error) {
      return this.responseFastify.errorResponse(reply, error as Error);
    }
  };

  public delete = async (
    req: FastifyRequest<{ Body: { userId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const result = await this.sessionService.delete(req.body.userId);
      return this.responseFastify.successResponse(reply, result);
    } catch (error) {
      return this.responseFastify.errorResponse(reply, error as Error);
    }
  };
}

export default SessionController;
