import { FastifyInstance } from "fastify";
import SessionController from "../../application/controller/session.controller";

export class SessionRoutes {
  static routes = async (fastify: FastifyInstance) => {
    const sessionController = new SessionController();
    if (process.env.ENV === "local") {
      // for local test
      fastify.post("/", sessionController.createOrUpdate);
      fastify.get("/", sessionController.verify);
      fastify.delete("/", sessionController.delete);
    }
  };
}
