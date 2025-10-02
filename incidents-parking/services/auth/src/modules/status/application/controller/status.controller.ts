import { FastifyReply, FastifyRequest } from 'fastify';
import ResponseFastifyAdapter from '../../../../common/adapters/responseFastifyAdapter';
import { StatusService } from '../../domain/services/status.service';

export class StatusController {
	constructor(
		private readonly responseAdapter = new ResponseFastifyAdapter(),
		private readonly status = new StatusService()
	) {}

	public getAll = async (req: FastifyRequest, reply: FastifyReply) => {
		try {
			const lang = req.headers['lang'] as string;
			const status = await this.status.getAll(lang);

			return this.responseAdapter.successResponse(reply, status);
		} catch (err) {
			return this.responseAdapter.errorResponse(reply, err as Error);
		}
	};
}
