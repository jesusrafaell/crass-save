import { ObjectId } from "mongodb";

/* eslint-disable camelcase */
export interface IncidentNotificationDB {
  _id: ObjectId;
  incident_id: ObjectId;
  user_id: ObjectId;
  status: 0 | 1; //0=off / 1=on //0 in range 1 out  range
  created_time: number;
  // notifiedIncidents: ObjectId[]; //in work is Set
}

//created
// const userNotificationSet = new Set(userNotificationFromDB.notifiedIncidents);

//DB
// notifiedIncidents: Array.from(userNotificationSet),
