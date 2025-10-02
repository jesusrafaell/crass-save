import { UserResponse } from "../../../user/domain/models/userRes";

export type SOType = "android" | "ios" | "web";

export interface GuestDto {
  utc: SOType;
  so: SOType;
}

export interface Login {
  email: string;
  password: string;
  so: SOType;
}

export interface LoginTruck extends Login {
  licensePlate: string;
}

export interface LoginParking extends Login {
  svc: "parking" | "company";
}

export interface NewUserDTO {
  first_name: string;
  last_name: string;
  email: string | null;
  password: string;
  mobile: string | null;
  utc: string;
  guest?: boolean;
  os?: string;
}

export interface RegisterUserDetail {
  id: string;
  transport_name: string;
  transport_key: string;
  identification_image: string;
  type: string;
}

export interface LoginResponse {
  user: UserResponse;
  //delete this ->
  transport?: {
    type: number;
  };
  localization?: UserLocalization;
  licensePlate?: string;
  access_token: string;
}

export interface LoginParkginResponse {
  user: UserResponse;
  parking: {
    id: string;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    address: string;
    availableSpace: number;
  } | null;
  company: {
    id: string;
    name: string;
    description: string;
    credits: number;
  } | null;
  localization?: UserLocalization;
  access_token: string;
}

interface UserLocalization {
  latitude: number;
  longitude: number;
}
