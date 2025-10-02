import { ICoordinates, IDriver, ILocation, IPosition } from ".";

export interface IRequestAssistence {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
  };
  vehicle: {
    year: number;
    licensePlate: string;
    imagePath: string;
    color: {
      // id: string;
      name: string;
      hex: string;
    };
    make: {
      // id: string;
      name: string;
    };
    model: {
      // id: string;
      name: string;
    };
    type: {
      // id: string;
      name: string;
    };
    weight: {
      // id: string;
      name: string;
    };
    engineType: {
      // id: string;
      name: string;
    };
    driveTrainType: {
      // id: string;
      name: string;
    };
  };
  driver?: IDriver;
  towTruck?: {
    // id: string;
    year: number;
    licensePlate: string;
    imagePath: string;
    color: {
      // id: string;
      name: string;
      hex: string;
    };
    make: {
      // id: string;
      name: string;
    };
    craneType: {
      // id: string;
      name: string;
    };
  };
  from: {
    latitude: number;
    longitude: number;
    address: string;
  };
  to: {
    latitude: number;
    longitude: number;
    address: string;
    description: string;
  };
  status: {
    // id: string;
    name: string;
    key: string;
  };
  company?: {
    id: string;
    name: string;
    key: number;
  };
  accepted: ICoordinates;
  userToDestination: number;
  driverToUser?: number;
  active: boolean;
  price: number;
  stars?: number;
  createdAt: number;
  timeElapsed: {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  };
  acceptedTime?: number;
  toUserTime: number;
  arrivedUserTime: number;
  toDestinationTime: number;
  arrivedDestinationTime: number;
  driverCompletedTime: number;
  finishTime: number;
}
