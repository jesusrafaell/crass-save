/* eslint-disable camelcase */
import { ObjectId } from "mongodb";

export interface UserTruckDto {
  _id: ObjectId;
  userId: string;
  licensePlate: string;
  company: string;
  updatedAt: number;
}
