import { FastifyReply, FastifyRequest } from 'fastify';
import ResponseFastifyAdapter from '../../common/adapters/responseFastifyAdapter';
import { ParkingService } from '../../domain/services/parking.service';
import { Parking } from '../../domain/models/parking';

export class ParkingController {
    constructor(
        private readonly responseAdapter = new ResponseFastifyAdapter(),
        private readonly parkingService = new ParkingService(),
    ) {}

    public getAll = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const parkings = await this.parkingService.getAll();
            return this.responseAdapter.successResponse(reply, parkings)
        } catch (err) {
            return this.responseAdapter.errorResponse(reply, err as Error)
        }
    }

    public create = async (req: FastifyRequest<{ Body: Parking }>, reply: FastifyReply) => {
        try {
            await this.parkingService.create(req.body);
            return this.responseAdapter.successCreatedResponse(reply)
        } catch (err) {
            return this.responseAdapter.errorResponse(reply, err as Error)
        }
    }
};


