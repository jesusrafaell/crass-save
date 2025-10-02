import truck2 from "@/images/tow-truck-2.png";
import truck3 from "@/images/tow-truck-3.png";
import truck from "@/images/tow-truck.png";
import { ILocation } from "@/models";

export const centerDefault: ILocation[] = [
  {
    lat: 0,
    lng: 0,
    userID: "",
  },
  // {
  //   lat: 10.464851,
  //   lng: -66.820696,
  //   userID: "",
  // },
];

export const getTypeTruckIcon = (type?: string) => {
  switch (type) {
    case "2":
      return truck.src;
    case "1":
      return truck3.src;
    default:
      return truck2.src;
  }
};

export const calculateCenterMap = (locations: ILocation[]): ILocation => {
  let totalLat = 0;
  let totalLng = 0;
  let count = locations.length;

  locations.forEach((location) => {
    totalLat += location.lat;
    totalLng += location.lng;
  });

  let centerLat = totalLat / count;
  let centerLng = totalLng / count;

  return {
    userID: "center",
    lat: centerLat,
    lng: centerLng,
  };
};

export const calculateZoom = (positions: ILocation[]): number => {
  if (!positions.length) return 12;
  // Definimos un rango de zoom que consideramos adecuado para centrar los puntos
  const minZoom = 10; // Zoom mínimo
  const maxZoom = 18; // Zoom máximo

  // Calculamos el rango de latitud y longitud
  let minLat = positions[0].lat;
  let maxLat = positions[0].lat;
  let minLng = positions[0].lng;
  let maxLng = positions[0].lng;

  for (const position of positions) {
    minLat = Math.min(minLat, position.lat);
    maxLat = Math.max(maxLat, position.lat);
    minLng = Math.min(minLng, position.lng);
    maxLng = Math.max(maxLng, position.lng);
  }

  // Calculamos el rango de latitud y longitud en grados
  const latRange = maxLat - minLat;
  const lngRange = maxLng - minLng;

  // Calculamos el zoom basado en el rango más grande
  const zoom = Math.ceil(
    Math.min(
      Math.abs(Math.log(Math.abs(latRange) / 360) / Math.log(2)),
      Math.abs(Math.log(Math.abs(lngRange) / 360) / Math.log(2))
    )
  );
  // Aseguramos que el zoom esté dentro del rango definido
  return Math.min(Math.max(zoom, minZoom), maxZoom);
};
