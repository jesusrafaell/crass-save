export class GeoAdapter {
  constructor() {}

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  public haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radio de la Tierra en kilómetros

    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // radial to km
    const distance = R * c;

    // convert to mtrs
    const distanceMeters = distance * 1000;

    return distanceMeters;
  }
}
