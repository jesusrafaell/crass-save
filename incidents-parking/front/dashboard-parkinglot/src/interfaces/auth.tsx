export interface ILoginTruck {
  user: User;
  transport: Transport;
  localization: Localization;
  access_token: string;
  ok: boolean;
}

export interface Localization {
  longitude: number;
  latitude: number;
}

export interface Transport {
  type: number;
}

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  image: string;
  status: string;
  distance_radius: number;
  role: RoleTruck;
  utc: string;
  created_time: number;
  updated_time: number;
  fcm_token: string;
  id: string;
  udpated_time: number;
}

export interface RoleTruck {
  _id: string;
  name: string;
  key: number;
}

export type ITypeLogin = "parking" | "company";

export interface UserState {
  user: UserParkings | null;
  token: string;
  info?: Parking | Company;
}

export interface IParkingLogin {
  user: UserParkings;
  access_token: string;
  ok: boolean;
  parking?: Parking;
  company?: Company;
}

export interface Parking {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  address: string;
  availableSpace: number;
}

export interface UserParkings {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  image: string;
  mobile: string;
  distance_radius: number;
  utc: string;
  fcm_token: string;
  created_time: string;
  updated_time: string;
  status: string;
  role: null;
  guest: boolean;
  roles: Role[];
  transportType: TransportType;
}

export interface Role {
  id: string;
  key: string;
  name: string;
}

export interface TransportType {
  type: number;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  credits: number;
}

export interface IErrors {
  path: string;
  code: string;
}

export interface IError {
  error: string;
  name: string;
  stack: string;
  ok: boolean;
}
