import { LocationDto } from "../../../location/domain/models/location";
import { User } from "../../../user/domain/models/user";

export interface NotificationUser {
  title: string;
  message: string;
  sound: string;
  userId: string;
}

export interface NotificationUserInRadius
  extends Omit<NotificationUser, "userId"> {
  latitude: number;
  longitude: number;
  radius: number;
  userId?: string;
}

export interface UserLocation {
  user: User;
  location: LocationDto;
}
