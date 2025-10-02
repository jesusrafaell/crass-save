import { FastifyInstance } from "fastify";
import ResponseFastifyAdapter from "../adapters/responseFastifyAdapter";
import listPublicRoutes from "./listPulicRoutes";

export class UserIdMiddleware {
  private app: FastifyInstance;

  constructor(
    app: FastifyInstance,
    private readonly responseFastifyAdapter = new ResponseFastifyAdapter()
  ) {
    this.app = app;
  }

  public checkUserId() {
    this.app.addHook("preHandler", async (request, reply) => {
      const validUrl = listPublicRoutes.some((route) =>
        request.raw.url?.includes(route)
      );

      if (validUrl) {
        return;
      }

      const userId = request.headers["x-user-id"];
      const role = request.headers["x-role"];

      if (!userId || !role) {
        const error = new Error("headers invalid format");
        this.responseFastifyAdapter.authErrorResponse(reply, error);
        return;
      }

      request.headers["userId"] = userId;
      request.headers["role"] = role;
    });
  }
}
