export const latitudeToKm = (radius: number) => radius / 111.32;
export const longitudeToKm = (radius: number, latitude: number) =>
  radius / (111.32 * Math.cos((latitude * Math.PI) / 180));
