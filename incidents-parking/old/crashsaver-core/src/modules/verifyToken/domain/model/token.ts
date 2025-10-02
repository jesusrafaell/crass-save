import { ObjectId } from "bson";

export type SOType = "android" | "ios" | "web";

//format token auth
export interface DtoToken {
  _id: string;
  id: string;
  email: string;
  so: SOType;
}

export type TypeVerifyToken = "verifyEmail" | "passwordReset";

export interface TokenDto {
  _id: string;
  email: string;
}

export interface VerifyToken {
  token: string; //token by TokenDto
  user_id: string;
  type: TypeVerifyToken;
  created_time: number;
  updated_time: number;
}

export interface VerifyTokenDB extends Omit<VerifyToken, "_id" | "user_id"> {
  _id: ObjectId;
  user_id: ObjectId;
}
