import { CoordinatesDto } from "../../../localization/domain/model/Coordinates";

export interface CreateIncidentMobile {
  longitude: number;
  latitude: number;
  transportType: string; //-> movil incident key
}

export interface IncidentMobileDto {
  _id: string;
  location: CoordinatesDto;
  status: 0 | 1; //for register
  user_id: string;
  transport_type: string; //-> movil incident key
  created_time: number;
  updated_time: number;
}
