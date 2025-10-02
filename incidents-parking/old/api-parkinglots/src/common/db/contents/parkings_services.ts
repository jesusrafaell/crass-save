import { NewParkingsServices } from '../../../domain/models/parkingServices';
import { ParkingRepository } from '../../../infrastructure/repository/parkingRepository';
import { ServicesRepository } from '../../../infrastructure/repository/servicesRepository';
import { StatusRepository } from '../../../infrastructure/repository/statusRepository';

const getRandomNumber = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const preParkingXServices = async () => {
	console.log('run');
	const statusRepo = new StatusRepository();
	const status = await statusRepo.getByNameEN("active");

	if (!status) {
	    throw {message: "Error status"}
	}

	console.log("status", status.id)

	const parkingRepo = new ParkingRepository();

	const parkings = await parkingRepo.getAll();

	console.log('Parkings:', parkings.length);

	const servicesRepo = new ServicesRepository();
	const services = await servicesRepo.getAll('en');

	console.log('Services:', services.length);

	const repo = new ParkingRepository();

	for (let pk of parkings) {
		console.log('Parking: ', pk.name);
		for (let svc of services) {
			const pkSvc: NewParkingsServices = {
				id_parking: pk.id, //UUID
				id_service: svc.id, //UUID
				id_status: status.id, //UUID
				price: getRandomNumber(5, 20),
				createdAt: 0,
				updatedAt: 0,
			};
			console.log(pkSvc);
			await repo.AddServiceToParking(pkSvc);
		}
		console.log('Services:', services.length);
	}

	console.log('Already Parkings_Services');
};
