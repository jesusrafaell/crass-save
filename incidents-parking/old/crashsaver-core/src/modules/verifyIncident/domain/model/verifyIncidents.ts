import { ObjectId } from "bson";

/* eslint-disable camelcase */
//1=continue, 2=finish, 3=skip
type Option = 1 | 2 | 3;

export interface CreateVerifyIncident {
  incident_id: string;
  option: Option;
}

export interface VerifyIncident {
  incident_id: string;
  user_id: string;
  option: Option;
  created_time: number;
  updated_time: number;
}