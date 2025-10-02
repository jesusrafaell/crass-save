import { FastifyInstance } from 'fastify';
import { CompanyController } from '../../application/controllers/company.controller';

export class CompanyRoutes {
    static routes = async (fastify: FastifyInstance) => {
        const companyController = new CompanyController();

        fastify.get('/all', companyController.getAll);
        fastify.get('/:id', companyController.getById);
        // fastify.get('/:id', companyController.getById);
        fastify.post('/', companyController.create);
        // fastify.put('/', companyController.update);
        // fastify.delete('/', companyController.delete);

    }
}