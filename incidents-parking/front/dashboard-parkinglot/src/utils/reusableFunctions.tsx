import { DateTime } from "luxon";

export const convertSectoDate = (timestamp: string | number) => {
  const date = DateTime.fromSeconds(
    typeof timestamp === "number" ? timestamp : Number(timestamp)
  ).toFormat("dd/MM/yyyy hh:mma");
  return date;
};
