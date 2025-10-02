import { FastifyInstance } from "fastify";
import VersionsController from "../../app/controller/version.controller";

export class VersionRoutes {
  static routes = async (fastify: FastifyInstance) => {
    const versionsController = new VersionsController();

    fastify.get("/mobile", versionsController.get);
    // fastify.put("/mobile/:id", versionsController.update);
  };
}
