import moment from "moment";

export function currentUnixTime() {
  return moment().unix();
}

export const nativeCurrentUnixTime = (date: Date = new Date()): number =>
  Math.floor(date.getTime() / 1000);

export const generateDaysAddedDate = (daysAdded: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAdded);
  return Math.floor(date.getTime() / 1000);
};
