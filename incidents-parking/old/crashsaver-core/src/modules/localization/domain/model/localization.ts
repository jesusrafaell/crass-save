/* eslint-disable camelcase */
import { ObjectId } from "mongodb";
import { CoordinatesDto } from "./Coordinates";

export interface DTOCreateLocalization {
  user_latitude: number;
  user_longitude: number;
}

export interface Localization {
  _id: string;
  user_latitude: number;
  user_longitude: number;
  location: CoordinatesDto;
  last_update: number;
  user_id: string;
}

export interface LocalizationDB extends Omit<Localization, "_id" | "user_id"> {
  _id: ObjectId;
  user_id: ObjectId;
}


export interface UpdateLocation {
  latitude: number;
  longitude: number;
}