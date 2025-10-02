export function unixToFormattedDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function formatTimeElapsed(
  hoursT: number,
  minutesT: number,
  secondsT: number
): string {
  const hours = String(hoursT).padStart(2, "0");
  const minutes = String(minutesT).padStart(2, "0");
  const seconds = String(secondsT).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
