import { ObjectId } from "mongodb";

type StatusType = "new" | "activo" | "inactive" | "suspended" | "locked";

export interface RoleCore {
  _id: ObjectId;
  name: string;
  key: number;
}

export interface UserCore {
  _id: ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mobile: string;
  image: string;
  status: StatusType;
  distance_radius: number;
  role?: RoleCore;
  utc: string;
  created_time: number;
  updated_time: number;
  fcm_token: string;
  is_guest?: boolean;
  transport_type: number;
}