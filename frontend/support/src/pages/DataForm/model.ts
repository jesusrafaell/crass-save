export type FormDataProps = {
  data: IData;
  setData: (props: IData) => void;
};

export type OptionProps = {
  id: string;
  name: string;
  hex?: string;
};

export interface IData {
  fullName: string;
  mobile: string;
  email: string;
  vehicles: VehicleState[];
}

export interface VehicleState {
  id: string;
  licensePlate: string;
  color: OptionProps;
  type: OptionProps;
  driveTrainType: OptionProps;
  engineType: OptionProps;
  insurance: OptionProps;
  weight: OptionProps;
  country: OptionProps;
  make: OptionProps;
  model: OptionProps;
}

export interface FormProps {
  formSelectData: { [key: string]: any };
  userFetchedData: UserFetchedData;
}

export interface CustomSelectProps {
  label: string;
  selected: OptionProps;
  options: OptionProps[] | null;
  after?: string;
  disabled?: boolean;
  onChange: (value: OptionProps) => void;
}

interface Role {
  id: string;
  name: string;
  key: number;
}

interface CurrentRole {
  id: string;
  name: string;
  key: number;
}

interface Status {
  id: string;
  name: string;
  key: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface Company {
  id: string;
  name: string;
  key: number;
  location: Location;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
  utc: string;
  photo: string;
  fcmToken: string | null;
  driverMode: boolean;
  roles: Role[];
  currentRole: CurrentRole;
  status: Status;
  location: Location;
  company: Company;
  createdTime: number;
  updatedTime: number;
  online: boolean;
}

interface Make {
  id: string;
  name: string;
}

interface Model {
  id: string;
  name: string;
}

interface EngineType {
  id: string;
  name: string;
}

interface DriveTrainType {
  id: string;
  name: string;
}

interface Insurance {
  id: string;
  name: string;
}

interface Country {
  id: string;
  name: string;
}

interface Type {
  id: string;
  name: string;
  key: number;
}

interface Weight {
  id: string;
  name: string;
  key: number;
}

interface Color {
  id: string;
  name: string;
  hex: string;
}

interface Vehicle {
  id: string;
  createdAt: number;
  updatedAt: number;
  year: number;
  userId: string;
  licensePlate: string;
  policyNumber: string;
  imagePath: string;
  active: boolean;
  make: Make;
  model: Model;
  engineType: EngineType;
  driveTrainType: DriveTrainType;
  insurance: Insurance;
  country: Country;
  type: Type;
  weight: Weight;
  color: Color;
}

export interface UserFetchedData {
  user: User;
  vehicles: Vehicle[];
}
