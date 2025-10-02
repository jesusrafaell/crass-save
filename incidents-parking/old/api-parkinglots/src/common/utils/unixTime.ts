import moment from 'moment';

export function currentUnixTime() {
  return moment().unix();
}

export const nativeCurrentUnixTime = ({
  inSeconds = true,
}: { inSeconds?: boolean } = {}) => {
  const date = new Date().getTime();

  if (inSeconds) return Math.floor(date / 1000);
  return date;
};