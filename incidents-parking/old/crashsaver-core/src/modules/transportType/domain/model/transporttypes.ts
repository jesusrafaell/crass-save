import { ObjectId } from "mongodb";

export interface TransportTypeDB {
  _id: ObjectId;
  name: string;
  key: number;
}
