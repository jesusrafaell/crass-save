export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IErrors {
  path: string;
  code: string;
}

export interface IError {
  error: string;
  name: string;
  stack: string;
  ok: boolean;
}

export interface ILoginResponse {
  data: IUserData;
  ok: boolean;
}

export interface IUserData {
  user: IUser;
  company: ICompany;
  access_token: string;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  mobile: string;
  utc: string;
  fcmToken: string;
  status: string;
  roles: Role[];
  role: Role;
  lastLocation: LastLocation;
  createdTime: string;
  updatedTime: string;
}

export interface ICompany {
  id: string;
  name: string;
  key: number;
  latitude: number;
  longitude: number;
}

export interface ICompanyData extends ICompany {
  description: string;
  email: string;
  mobile: string;
  active: boolean;
  totalUser?: number;
  totalDriver?: number;
}

export interface LastLocation {
  latitude: number;
  longitude: number;
}

export interface Role {
  id: string;
  key: number;
  name: string;
}

export interface ILocation {
  lat: number;
  lng: number;
  userID: string;
  realTime?: boolean;
}

export interface IFBLocation {
  [key: string]: IPosition;
}

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface IPosition extends ICoordinates {
  updatedAt: number;
}

export interface IMapProps {
  drivers: ILocation[];
  users?: ILocation[];
  origin?: ILocation;
  destination?: ILocation;
  mapConfig: { zoom: number; center: ILocation };
  setlocSelected: any;
}

export interface IMenuItems {
  name: string;
  link: string;
}

export interface IDisclosure {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: () => void;
  isControlled: boolean;
  getButtonProps: (props?: any) => any;
  getDisclosureProps: (props?: any) => any;
}

export interface IResp<T> {
  message: string;
  ok: boolean;
  data: T;
}

export interface IRequest {
  id: string;
  user: IDriver;
  vehicle: IVehicle;
  driver: IDriver;
  towTruck: ITowTruck;
  from: IFrom;
  to: IFrom;
  status: IStatus;
  createdAt: number;
}

export interface IDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

export interface IFrom {
  latitude: number;
  longitude: number;
  address: string;
  description?: string;
}

export interface IStatus {
  id: string;
  name: string;
  key: string;
}

export interface ITowTruck {
  id: string;
  year: number;
  licensePlate: string;
  imagePath: string;
  color: IColor;
  make: IType;
  craneType: IType;
  maximumLoad: number;
  length: number;
  height: number;
}

export interface IColor {
  id: string;
  name: string;
  hex: string;
}

export interface IType {
  id: string;
  name: string;
  key: number;
}

export interface IVehicle {
  id: string;
  year: number;
  licensePlate: string;
  imagePath: string;
  color: IColor;
  make: IType;
  model: IType;
  type: IType;
  weight: IType;
  engineType: IType;
  driveTrainType: IType;
}

export interface IDriverData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  photo: string;
  driverMode: boolean;
  status: {
    id: string;
    name: string;
    key: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  towTruck: {
    year: number;
    licensePlate: string;
    imagePath: string;
    make: string;
    color: string;
  };
  reqId: string;
}

export interface IDriverInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  status: {
    key: string;
    name: string;
  };
  online: boolean;
}

export interface ITowTruckDriver {
  id: string;
  year: number;
  licensePlate: string;
  policyNumber: string;
  imagePath: string;
  userId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
  };
  active: boolean;
  color: {
    id: string;
    name: string;
    hex: string;
  };
  weight: {
    id: string;
    name: string;
  };
  make: {
    id: string;
    name: string;
  };
  craneType: {
    id: string;
    name: string;
  };
  country: {
    id: string;
    name: string;
  };
  engineType: {
    id: string;
    name: string;
  };
  driveTrainType: {
    id: string;
    name: string;
  };
  insurance: {
    id: string;
    name: string;
  };
  createdAt: number;
  updatedAt: number;
}

export interface IBase {
  id: string;
  name: string;
}

export interface IBaseLang {
  id: string;
  en: string;
  es: string;
}
export interface ICoin {
  id: string;
  key: number;
  name: string;
  symbol: string;
}
export interface IExpenseRecord {
  id: string;
  companyId: string;
  towTruckId: string;
  userId: string;
  amount: number;
  coinId: string;
  coin: ICoin;
  unixDate: number;
  repairDescription?: string;
  fuelLiters?: number;
  expenseType: number;
}

export interface IPriceRate {
  id: string;
  km: number;
  priceKm: number;
  key: string;
  coinId: string;
  coin: ICoin;
  typeId: string;
}

export interface ITypeRatePrice {
  type: IType;
  prices: IPriceRate[];
}

export interface ITypeRatePriceTable {
  keysKm: number[];
  ratePrices: ITypeRatePrice[];
}

export interface IFees {
  types: [
    {
      id: string;
      createdAt: number;
      updatedAt: number;
      es: string;
      en: string;
      key: number;
    }
  ];
  prices: [
    {
      km: number;
      priceKm: number;
      op: string;
    },
    {
      km: number;
      priceKm: number;
      op: string;
    }
  ];
}
