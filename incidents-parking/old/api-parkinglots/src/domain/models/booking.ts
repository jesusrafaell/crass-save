import { Companies } from "./company";
import { Parking } from "./parking";
import { Services } from "./parkingServices";
import { Status } from "./status";
import { UserInfo } from "./userinfo";

export interface Booking {
  id: string;
  licensePlate: string;
  lpContainer: string;
  description: string;
  initTime: number;
  endTime: number;
  hours: number;
  price: number;
  //services (auth-user)
  userId: string;
  user?: UserInfo;
  //relations
  driverId: string | null;
  driver?: UserInfo;
  parkingId: string;
  parking?: Parking;
  companyId: string;
  company?: Companies;
  statusId: string;
  status?: Status;
  serviceIds: string[];
  services?: Services[];
  createdAt: number;
  updatedAt: number;
}

export interface BookingUpdate {
  //id: string;
  licensePlate?: string;
  lpContainer?: string;
  description?: string;
  initTime?: number;
  endTime?: number;
  hours?: number;
  price?: number;
  //services (auth-user)
  userId?: string;
  //relations
  driverId?: string;
  parkingId?: string;
  companyId?: string;
  statusId?: string;
  status?: string;
  serviceIds?: string[];
}

export interface BookingRequest {
  description: string;
  userId: string;
  driverId?: string;
  initTime: number;
  endTime: number;
  hours: number;
  licensePlate: string; //placa
  lpContainer: string; //placa container
  price: number;
  parkingId: string; // UUID
  companyId: string;
  serviceIds: string[]; //UUID foreign key services
}

export interface BookingResponse {
  id: string;
  licensePlate: string;
  lpContainer: string;
  description: string;
  initTime: number;
  endTime: number;
  hours: number;
  price: number;
  userId: string;
  driverId: string | null;
  parking: Parking | null;
  company: Companies | null;
  status: Status | null;
  services: Services[];
  createdAt: number;
  updatedAt: number;
}
