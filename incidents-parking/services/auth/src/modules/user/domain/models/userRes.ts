import { Role } from "./general";

export interface UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  image: "";
  status: string;
  distance_radius: number;
  guest: boolean;
  role: null;
  roles: Role[] | [];
  utc: string;
  fcm_token: string | null;
  created_time: number;
  updated_time: number;
  transportType: {
    type: number; //key
  };
  // udpated_time: number;
}
