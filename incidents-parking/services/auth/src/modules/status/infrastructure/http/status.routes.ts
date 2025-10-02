import { FastifyInstance } from 'fastify';
import { StatusController } from '../../application/controller/status.controller';

export class StatusRoutes {
  static routes = async (fastify: FastifyInstance) => {
    const statusController = new StatusController();
    fastify.get('/', statusController.getAll);
  };
}
