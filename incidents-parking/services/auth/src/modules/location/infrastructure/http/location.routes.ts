import { FastifyInstance } from "fastify";
import LocationController from "../../application/controller/location.controller";
import { schema } from "../../../../common/validator/location/location";
import { userLocationValidator } from "../../../../common/validator/location/userLocation";
import Validator from "../../../../common/validator";

export class LocationRoutes {
  static routes = async (fastify: FastifyInstance) => {
    const locationController = new LocationController();
    fastify.get("/:id", locationController.getById);
    fastify.get("/", locationController.getByUserId);
    fastify.post("/", locationController.create);

    fastify.route({
      method: "PUT",
      url: "/",
      // schema: userLocationValidator,
      // preHandler: Validator.validateHook,
      handler: locationController.updateByUserId,
    });

    fastify.delete("/", locationController.deleteByUserId);

    fastify.get(
      "/user-radius",
      {
        schema,
      },
      locationController.getInRadius
    );
  };
}
