import { Status } from "../../../status/domain/models";
import { OS, Role, TransportTypes } from "./general";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  password: string;
  email: string | null;
  mobile: string | null;
  distance_radius: number;
  utc: string;
  fcm_token: string | null;
  guest: boolean;
  id_roles: string[];
  roles?: Role[] | [];
  id_os: string | null;
  os: OS | null;
  id_status: string;
  status?: Status;
  id_transport_type: string;
  transportType?: TransportTypes;
  id_auth_identification: string;
  created_time: number;
  updated_time: number;
}

export interface UserRes {
  id: string;
  first_name: string;
  last_name: string;
  password: string;
  email: string | null;
  mobile: string | null;
  distance_radius: number;
  utc: string;
  fcm_token: string | null;
  guest: boolean;
  roles?: Role[] | [];
  os?: OS;
  status?: Status;
  transportType?: TransportTypes;
  created_time: number;
  updated_time: number;
}

export interface UserUpdate {
  id: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  email?: string;
  mobile?: string;
  distance_radius?: number;
  utc?: string;
  fcm_token?: string;
  id_os?: string;
  id_status?: string;
  status?: string;
  transportTypeKey?: number;
  id_transport_type?: string;
  os?: string;
}

export interface UserXCompany {
  userId: string;
  companyId: string;
}

export interface DriverXCompanyRequest {
  driverId: string;
  companyId: string;
}

export interface DriverXCompany {
  id: string;
  id_driver: string;
  id_company: string;
  created_at: number;
  updated_at: number;
}

export interface UserXParking {
  userId: string;
  parkingId: string;
}

export interface UserBase {
  id: string;
  email: string;
}
