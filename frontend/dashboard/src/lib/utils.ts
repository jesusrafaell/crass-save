import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateToUnix(stringDate: string | Date): number {
  const date = new Date(stringDate);
  const miliseconds = date.getTime();
  const seconds = Math.floor(miliseconds / 1000);

  return seconds;
}
