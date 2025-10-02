import { FastifyInstance } from 'fastify';
import { ParkingController } from '../../application/controllers/parking.controller';

export class ParkingRoutes {
    static routes = async (fastify: FastifyInstance) => {

        const parkingController = new ParkingController();

        fastify.get('/all', parkingController.getAll);
        // fastify.get('/:id', parkingController.getById);
        fastify.post('/', parkingController.create);
        // fastify.put('/', parkingController.update);
        // fastify.delete('/', parkingController.delete);

    }
}