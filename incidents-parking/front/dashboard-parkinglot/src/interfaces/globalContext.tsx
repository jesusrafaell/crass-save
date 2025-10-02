import { Product, Service } from "./booking";

export interface IGlobalContext {
  services: Service[];
  products: Product[];
  loading: boolean;
  showBalance: boolean;
  parkings: IParking[];
  status: IStatus[];
  companyList: ICompany[];
  putBookingStatus: (bookingId: string, statusId: string) => Promise<any>;
  cancelBooking: (bookingId: string) => Promise<any>;
  getServicesListByParking: (parkingId: string) => Promise<Service[]>;
  toggleShowBalance: () => void;
}

export interface IParking {
  id: string;
  country: string;
  name: string;
  latitude: number;
  longitude: number;
  availableSpace: string;
  price: number;
  services: Service[];
  hours: IPHours[];
}

export interface IPHours {
  hours: number;
  price: number;
}

export interface IStatus {
  id: string;
  name: string;
  key: string;
  type?: string;
}

export interface ICompany {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IActionResp {
  message: string;
  ok: boolean;
}

export interface IErrorResp {
  path: string;
  code: string;
}

export interface IBuyCreditsResp {
  ok: boolean;
  message: string;
  data: URLData;
}

export interface URLData {
  errorCode: number;
  challengeUrl: string;
}

export interface ILocation {
  lat: number;
  lng: number;
  name: string;
}
