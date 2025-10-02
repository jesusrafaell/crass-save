import { NewService} from "../../../domain/models/parkingServices";
import { ServicesRepository } from "../../../infrastructure/repository/servicesRepository";

const listServices: NewService[] = [
    { key: 1, en: "Barrier", es: "Puerta De Entrada",  createdAt: 0, updatedAt: 0 },
    { key: 2, en: "Fence", es: "Valla",  createdAt: 0, updatedAt: 0 },
    { key: 3, en: "Night Lights", es: "Luz Nocturna", createdAt: 0, updatedAt: 0 },
    { key: 4, en: "Camera", es: "Camara de vigilancia",  createdAt: 0, updatedAt: 0 },
    { key: 5, en: "Vigilance", es: "Personal de vigilancia",  createdAt: 0, updatedAt: 0 },
    { key: 6, en: "Toilet", es: "Aseos",  createdAt: 0, updatedAt: 0 },
    { key: 7, en: "Shower", es: "Ducha",  createdAt: 0, updatedAt: 0 },
    { key: 8, en: "Wifi", es: "Accesibilidad a Wifi",  createdAt: 0, updatedAt: 0 },
    { key: 9, en: "Frozen", es: "Frigorificos",  createdAt: 0, updatedAt: 0 },
    { key:10, en: "Electric", es: "Carga electrica",  createdAt: 0, updatedAt: 0 },
    { key:11, en: "ADR", es: "Transporte de mercancías peligrosas por carretera",  createdAt: 0, updatedAt: 0 },
    { key:12, en: "Long Parking", es: "Parking Largo",  createdAt: 0, updatedAt: 0 },
    { key:13, en: "Trailers", es: "Remolques",  createdAt: 0, updatedAt: 0 },
    { key:14, en: "Hotel", es: "Servicio de hotel",  createdAt: 0, updatedAt: 0 },
    { key:15, en: "Restaurant", es: "Servicio de Restaurante",  createdAt: 0, updatedAt: 0 }
];

export const preServices  = async() =>{
    const repo = new ServicesRepository()

    for (let i of listServices) {
        await repo.create(i)
    }

    console.log('Already services', listServices.length)
}