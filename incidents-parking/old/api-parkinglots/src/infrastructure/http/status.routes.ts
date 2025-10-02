import { FastifyInstance } from 'fastify';
import { StatusController } from '../../application/controllers/status.controller';

export class StatusRoutes {
	static routes = async (fastify: FastifyInstance) => {
		const statusController = new StatusController();
		//services
		fastify.get('/', statusController.getAll);
	};
}
