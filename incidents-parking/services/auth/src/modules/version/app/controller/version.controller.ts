import { FastifyReply, FastifyRequest } from "fastify";
import { Version } from "../../domain/model/version";
import { VersionService } from "../../domain/services/version.services";
import ResponseFastifyAdapter from "../../../../common/adapters/responseFastifyAdapter";

class VersionsController {
  constructor(
    private readonly responseAdapter = new ResponseFastifyAdapter(),
    private readonly versionsService = new VersionService()
  ) {}

  public get = async (_: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await this.versionsService.get();
      return this.responseAdapter.successResponse(reply, result);
    } catch (error) {
      return this.responseAdapter.errorResponse(reply, error as Error);
    }
  };

  // public update = async (
  //   req: FastifyRequest<{ Params: { id: string } }>,
  //   res: FastifyReply
  // ) => {
  //   try {
  //     const id = req.params.id;
  //     const version = req.body as Partial<Version>;
  //     const result = await this.versionsService.update(id, version);
  //     return this.responseAdapter.successResponse(res, result);
  //   } catch (error) {
  //     return this.responseAdapter.errorResponse(res, error as Error);
  //   }
  // };
}

export default VersionsController;
