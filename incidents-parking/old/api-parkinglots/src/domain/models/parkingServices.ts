export interface ServicesDB {
  id: string;
  en: string;
  es: string;
  key: number;
  createdAt: number;
  updatedAt: number;
}

export interface Services {
  id: string;
  name: string;
  key: number;
  createdAt: number;
  updatedAt: number;
}

export interface NewService extends Omit<ServicesDB, "id"> {}

export interface ParkingsServices {
  id: string; //UUID
  id_service: string; //UUID
  id_parking: string; //UUID
  id_status: string; //UUID
  price: number;
  createdAt: number;
  updatedAt: number;
}

export interface NewParkingsServices extends Omit<ParkingsServices, "id"> {}

export interface ParkingSVC {
  id: string;
  name: string;
  key: number;
  price: number;
  status: string;
  idStatus: string;
}
