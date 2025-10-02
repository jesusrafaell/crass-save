import { StatusRepository } from '../../infrastructure/repository/statusRepository';

export class StatusService {
	constructor(private readonly statusRepository = new StatusRepository()) {}

	public async getAll(lang: string) {
		try {
			const status = await this.statusRepository.getAll(lang);
			return status;
		} catch (err) {
			throw err;
		}
	}

	public async getByNameEN(name: string) {
		try {
			const status = await this.statusRepository.getByNameEN(name);
			if(!status){
				throw new Error ("Status not found.")
			}
			return status;
		} catch (err) {
			throw err;
		}
	}
}
