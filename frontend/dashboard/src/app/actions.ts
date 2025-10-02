"use server";

import { ICompany, IUser } from "@/models";
// import { IUser } from "@/models";
import { cookies } from "next/headers";

export const createSession = async (data: {
  user: IUser;
  company: ICompany;
  token: string;
}) => {
  cookies().set("authToken", data.token);
  cookies().set("user", JSON.stringify(data.user));
  cookies().set("company", JSON.stringify(data.company));
  return true;
};

export const getSession = async () => {
  return cookies().get("authToken");
};

export const getUser = async () => {
  const user = cookies().get("user")?.value;
  if (!user) return null;
  return JSON.parse(user);
};

export const destroySession = async () => {
  cookies().delete("authToken");
  cookies().delete("user");
  return true;
};

export const getCompany = async (): Promise<ICompany | null> => {
  const company = cookies().get("company")?.value;
  if (!company) return null;
  return JSON.parse(company);
};
