import { FastifyInstance } from "fastify";
import { ParkingServicesController } from "../../application/controllers/parkingServices.controller";

export class ParkingServicesRoutes {
  static routes = async (fastify: FastifyInstance) => {
    const parkingServicesController = new ParkingServicesController();
    //services
    fastify.get("/", parkingServicesController.getAll);
    //parkingservice
    fastify.get("/parking/:parkingId", parkingServicesController.getByParking);
    // fastify.get('/:id', parkingServicesController.getById);
    // fastify.post('/', parkingServicesController.create);
    // fastify.put('/', parkingServicesController.update);
    // fastify.delete('/', parkingServicesController.delete);
  };
}
