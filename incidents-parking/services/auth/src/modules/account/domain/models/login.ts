import { UserResponse } from "../../../user/domain/models/userRes";

export interface LoginReponse {
  user: UserResponse;
  // trasport: {
  //     type: number;
  // }
  localization: {
    latitude: number;
    longitude: number;
  };
  access_token: string;
}

export interface AssignBookingRequest {
  driverId: string;
  licensePlate: string;
}
