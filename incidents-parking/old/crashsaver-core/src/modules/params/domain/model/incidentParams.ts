import { ObjectId } from "mongodb";

//format token auth
export interface IncidentParams {
  _id: ObjectId;
  key: number;
  name: string;
  value: string;
}
