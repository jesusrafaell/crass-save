export interface CompanyDto {
  id: string;
  name: string;
  description: string;
  credits: number;
}

export interface ParkingDto {
  id: string;
  country: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  availableSpace: number;
}
