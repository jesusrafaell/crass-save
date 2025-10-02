/* eslint-disable camelcase */
import { ObjectId } from "mongodb";
import { SOType } from "../../../verifyToken/domain/model/token";

type IdentType = "passport" | "dni";

type StatusType = "new" | "activo" | "inactive" | "suspended" | "locked";

export interface GuestDto {
  utc: SOType;
  so: SOType;
}

/* eslint-disable camelcase */
export interface Login {
  email: string;
  password: string;
  so: SOType;
}

export interface LoginTruck {
  email: string;
  password: string;
  licensePlate: string;
  company: string;
  so: SOType;
}

export interface RegisterUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mobile: string;
  utc: string;
  quest?: boolean;
}

export interface Identification {
  type: IdentType;
  image: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mobile: string;
  image: string;
  status: StatusType;
  distance_radius: number;
  role: Role;
  utc: string;
  created_time: number;
  updated_time: number;
  fcm_token: string;
  is_guest: boolean;
  transport_type: number;
}

export interface UserDB extends Omit<User, "_id" | "role_id"> {
  _id: ObjectId;
  role_id: ObjectId;
}

export interface Role {
  _id: string;
  name: string;
  key: number;
}

export interface RoleDB extends Omit<Role, "_id"> {
  _id: ObjectId;
}

export interface UserXTruck {
  _id: string;
  userId: string;
  licensePlate: string;
  created_at: number;
  updated_at: number;
}