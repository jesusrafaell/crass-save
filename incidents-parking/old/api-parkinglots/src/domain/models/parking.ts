export interface Parking {
  id: string; // UUID in PostgreSQL
  country: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  availableSpace?: number;
  idStatus: string;
  createdAt: number;
  updatedAt: number;
}
