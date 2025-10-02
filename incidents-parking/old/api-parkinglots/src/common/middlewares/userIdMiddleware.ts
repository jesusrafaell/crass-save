import { FastifyInstance } from "fastify";
import ResponseFastifyAdapter from "../adapters/responseFastifyAdapter";

export class UserIdMiddleware {
 private app: FastifyInstance;

    constructor(
        app: FastifyInstance,
        private readonly responseFastifyAdapter = new ResponseFastifyAdapter(),
    ) {

    this.app = app;
  }

  public checkUserId() {
    this.app.addHook('preHandler', async (request, reply) => {

      const userId = request.headers['x-user-id'];

      if (!userId) {
          const error = new Error("UserId invalid")
          this.responseFastifyAdapter.authErrorResponse(reply, error)
          return;
      }

      request.headers['userId'] = userId;
    });
  }
}