export interface INewBooking {
  initTime: number;
  hours: number;
  licensePlate: string;
  lpContainer: string;
  companyId: string;
  parkingId: string;
  description: string;
  driverId?: string;
  //   statusId?: string;
  // endTime: number;
  // serviceIds: string[];
}

export interface Parking {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  services: Service[];
  // availableSpace: string;
}

export interface Status {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  key: number;
}

export interface IParkingListResp {
  data: IBooking[];
  ok: boolean;
}

export interface IBooking {
  id: string;
  licensePlate: string;
  description: string;
  initTime: string;
  endTime: string;
  hours: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  parking: Parking;
  status: Status;
  services: Service[];
  lpContainer: string;
  driverId: string;
  company: Company;
  parkingId: string;
  companyId: string;
  statusId: string;
  serviceIds: string[];
  driver: IDriver | null;
}

export interface IDriver {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

export type IBookingsTypes =
  | "licensePlate"
  | "parkingId"
  | "companyId"
  | "userId"
  | "all";

export type IBookingsTypesJson = {
  licensePlate?: string;
  parkingId?: string;
  companyId?: string;
  userId?: string;
  all?: boolean;
};

export interface Company {
  id: string;
  name: string;
  description: string;
}

export interface IGetProducts {
  ok: boolean;
  message: string;
  data: Product[];
}

export interface Product {
  id: string;
  name: string;
  price: string;
  credits: string;
}
