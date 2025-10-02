import { ObjectId } from "bson";
import { CoordinatesDto } from "../../../localization/domain/model/Coordinates";

/* eslint-disable camelcase */
export type IncidentStatus = 1 | 2 | 3;

export interface IncidentType {
  _id: string;
  key: string;
  name: string;
}

export interface CreateIncidentStatic {
  _id: string;
  description: string;
  latitude: number;
  longitude: number;
  incident_type_id: string;
}

export interface Incident {
  // image?: string;
  id: string;
  latitude: number;
  longitude: number;
  status: number;
  userId: string;
  description: string;
  incidentTypeId: string;
  distance: number;
  createUserId: string;
  verifyUser: false;
  createdTime: number;
  updatedTime: number;
}

export interface IncidentDB
  extends Omit<
    Incident,
    "_id" | "incident_type_id" | "user_id" | "transport_key"
  > {
  _id: ObjectId;
  incident_type_id: ObjectId;
  user_id: ObjectId;
}

export interface IncidentType {
  _id: string;
  name: string;
}

export interface IncidentTypeDB extends Omit<IncidentType, "_id"> {
  _id: ObjectId;
}

export interface DTODataByRadius {
  latitude: number;
  longitude: number;
  radius: number;
}
