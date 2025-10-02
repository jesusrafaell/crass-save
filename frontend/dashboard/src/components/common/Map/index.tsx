"use client";
import { getCompany } from "@/app/actions";
import GoogleMap from "@/components/common/Map/GoogleMap";
import ModalService from "@/components/common/Map/ModalService";
import { db, onValue, ref } from "@/lib/firebase";
import { IDisclosure, IFBLocation, ILocation } from "@/models";
import { calculateZoom, centerDefault } from "@/utils/mapUtils";
import { useDisclosure } from "@nextui-org/react";
import { DataSnapshot, off } from "firebase/database";
import { useEffect, useMemo, useState } from "react";

const Map = () => {
  const disclosure: IDisclosure = useDisclosure();
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [center, setCenter] = useState<ILocation>(centerDefault[0]);
  const [zoom, setZoom] = useState<number>(12);
  const [locSelected, setlocSelected] = useState<ILocation>();

  useEffect(() => {
    // Obtener la ubicación actual del dispositivo
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude, userID: "" });
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          // Puedes establecer un centro predeterminado en caso de error
          setCenter({ lat: 0, lng: 0, userID: "" }); // Ajusta según lo que consideres apropiado
        }
      );
    } else {
      console.error("La geolocalización no es compatible con este navegador.");
      setCenter({ lat: 0, lng: 0, userID: "" });
    }
  }, []); // Solo ejecuta una vez al cargar el componente

  const handleData = async (snapshot: DataSnapshot) => {
    const locations: IFBLocation = snapshot.val();
    if (!locations) {
      return;
    }
    const locationsFinal: ILocation[] = Object.keys(locations).map((key) => ({
      userID: key,
      lat: locations[key].latitude,
      lng: locations[key].longitude,
    }));
    setLocations(locationsFinal);
    if (!center || locationsFinal.length === 0) {
      // const centerCalc = calculateCenterMap(locationsFinal);
      const zoomCalc = calculateZoom(locationsFinal);
      setZoom(zoomCalc);
      // setCenter(centerCalc);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const company = await getCompany();
      if (company) {
        // console.log("Find Driver - Company:", company);
        const dbRef = ref(db, `locations/${company.key}`);
        onValue(dbRef, handleData, (error) => {
          console.error("Error connecting to the database:", error);
        });
        return () => off(dbRef);
      }
    };
    fetchData();
    // clear effect
    return () => {
      if (typeof fetchData === "function") {
        fetchData().then((cleanup) => cleanup && cleanup());
      }
    };

    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  useMemo(() => {
    if (!disclosure.isOpen) setlocSelected(undefined);
  }, [disclosure.isOpen]);
  return (
    <>
      <GoogleMap
        drivers={locations}
        mapConfig={{ center, zoom }}
        setlocSelected={setlocSelected}
      />
      <ModalService payload={locSelected} disclosure={disclosure} />
    </>
  );
};

export default Map;
