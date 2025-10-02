import { Parking } from '../../../domain/models/parking';
import { ParkingRepository } from '../../../infrastructure/repository/parkingRepository';
// import { StatusRepository } from "../../../infrastructure/repository/statusRepository";

const listParkings: Parking[] = [
	{
		id: '',
		country: 'Belgica',
		name: 'ZOLDER(TRUCK STOP)',
		latitude: 50.9939,
		longitude: 5.2408,
		address: 'Autohof Secure Truck Stop 26 bis Industrieweg 15, B-3550 Heusden-Zolder',
		availableSpace: 50,
		idStatus: '',
		createdAt: 0,
		updatedAt: 0,
	},
	{
		id: '',
		country: 'Belgica',
		name: 'BRUNO SAFE PARKING',
		latitude: 50.9094,
		longitude: 5.5214,
		address: 'Kruisbosstraat 2b1 E314 Exit 31/32 E313 Exit 30 3740 Bilzen Limburg-Vklanderen-Belgium',
		availableSpace: 20,
		idStatus: '',
		createdAt: 0,
		updatedAt: 0,
	},
	{
		id: '',
		country: 'Croacia',
		name: 'ROBNI TERMINALI ZAGREB',
		latitude: 45.7981,
		longitude: 15.8742,
		address: 'ROBNI TERMINALI ZAGREB Jankomir 25 A3 Zagreb ring 10090 Zagreb - Croatia',
		availableSpace: 20,
		idStatus: '',
		createdAt: 0,
		updatedAt: 0,
	},
	{
		id: '',
		country: 'Dinamarca',
		name: 'PADBORG CIRCLEK',
		latitude: 54.8303,
		longitude: 9.352,
		address: 'Statoil Servicecenter Industrivej 18-20',
		availableSpace: 20,
		idStatus: '',
		createdAt: 0,
		updatedAt: 0,
	},
	{
		id: '',
		country: 'Austria',
		name: 'PARK VORALPENKREUZ',
		latitude: 48.0664,
		longitude: 14.0347,
		address: 'Raststation Voralpenkreuz Highway A8-A1-A9 Voralpenkreuz 1/ A8 A-4642 Sattledt',
		availableSpace: 20,
		idStatus: '',
		createdAt: 0,
		updatedAt: 0,
	},
];

export const preParkings = async () => {
	//get status activo
	const statusRepo = new ParkingRepository();
	// const status = await statusRepo.getByName("active");

	// if (!status) {
	//     console.log('status not found')
	//     process.exit(1)
	// }

	const repo = new ParkingRepository();

	for (let i of listParkings) {
		i.idStatus = '';
		await repo.create(i);
	}

	console.log('Already Parkings', listParkings.length);
};
