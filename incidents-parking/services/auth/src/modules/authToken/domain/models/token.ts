export type OS = "android" | "ios" | "web";

export interface TokenDto {
  id: string;
  email: string;
  os: OS;
  role: number;
}
