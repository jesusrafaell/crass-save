import { ObjectId } from "bson";

export type TypeVerifyToken =
  | "verifyEmail"
  | "passwordReset"
  | "driverxcompany";

export interface TokenVerifyDto {
  id: string;
  email: string;
  os?: string;
}

export interface VerifyToken {
  _id: ObjectId;
  userId: string;
  companyId?: string;
  type: TypeVerifyToken;
  token: string;
  createdAt: number;
}
