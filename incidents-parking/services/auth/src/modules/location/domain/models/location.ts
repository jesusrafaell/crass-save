/* eslint-disable camelcase */
import { ObjectId } from 'mongodb';

export interface CoordinatesDto {
  type: string;
  coordinates: [number, number]; //longitude, latitude
}

export interface CreateLocalization {
  userLatitude: number;
  userLongitude: number;
}

export interface LocationDto {
  _id: ObjectId;
  location: CoordinatesDto;
  updatedAt: number;
  createAt: number;
  user_id: string;
}

export interface UpdateLocation {
  latitude: number;
  longitude: number;
}

export interface RequestUpdateLocation {
  userLatitude: number;
  userLongitude: number;
  incident_id: string;
}

export interface CoordinatesData {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface DataRange {
  gte: number;
  lte: number;
}

export interface GetLocalizationInRadius {
  userLatitude: DataRange;
  userLongitude: DataRange;
}
