import { ObjectId } from "mongodb";
import { IncidentDB  } from "./incident";

export interface IncidentWithRelations extends IncidentDB {
  incident_type: {
    _id: ObjectId;
    name: string;
    key: string;
  };
  user: {
    _id: ObjectId;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
  };
}

export interface GeoSpatialIncidentRes extends IncidentDB {
  verify_user: boolean;
  incident_type: {
    _id: ObjectId;
    name: string;
    key: string;
  };
}

export type IncidentStatus = "active" | "in_progress" | "resolved";

export interface DTOResIncidents {
  _id: string;
  description: string;
  latitude: number;
  longitude: number;
  created_time: number;
  status: IncidentStatus;
  incident_type_id: string;
  create_user_id: string;
  verify_user: boolean;
  distance: number;
}
