"use client";
import React, { useEffect, useState } from "react";
import { IRequestAssistence } from "@/models/request";
import { useFetchData } from "@/hooks/useFetchData";
import LoadingWrapper from "@/components/common/LoadingWrapper";
import styled from "styled-components";
import { db, onValue, ref } from "@/lib/firebase";
import { DataSnapshot, off } from "firebase/database";
import { ILocation, IPosition } from "@/models";
import {
  calculateCenterMap,
  calculateZoom,
  centerDefault,
} from "@/utils/mapUtils";
import GoogleMap from "@/components/common/Map/GoogleMap";
import {
  Card as UICard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const MapPage = ({ params }: { params: { requestId: string } }) => {
  const {
    data: request,
    error,
    isLoading,
    refreshData,
  } = useFetchData<{
    data: IRequestAssistence;
  }>("api/v1/assistance/requests/" + params.requestId);

  const [locations, setLocations] = useState<ILocation[]>([]);

  const [center, setCenter] = useState<ILocation>(centerDefault[0]);
  const [zoom, setZoom] = useState<number>(12);
  const [locSelected, setlocSelected] = useState<ILocation>();

  const updateDrivers = (driver: ILocation) => {
    const list: ILocation[] = [{ ...driver }];
    setLocations(list);
  };

  const handleData = (driverId: string, snapshot: DataSnapshot) => {
    const driver: IPosition = snapshot.val();
    if (!driver) {
      return;
    }
    updateDrivers({
      userID: driverId,
      lat: driver.latitude,
      lng: driver.longitude,
      realTime: true,
    });
  };

  const fetchData = async () => {
    const req = request?.data;
    if (req && req.company && req.driver) {
      if (locations.length < 1) {
        const driver = req.driver;
        updateDrivers({
          userID: driver.id,
          lat: req.from.latitude,
          lng: req.from.longitude,
          realTime: false,
        });
        if (req.active == true) {
          const dbRef = ref(
            db,
            `locations/${req.company.key}/${req.driver.id}`
          );
          onValue(dbRef, (snap) => handleData(driver.id, snap));
          return () => off(dbRef);
        }
      }
    }
  };

  useEffect(() => {
    let cleanupFunction: (() => void) | undefined;

    if (request) {
      fetchData().then((cleanup) => {
        cleanupFunction = cleanup;
      });

      const list: ILocation[] = [
        {
          userID: request.data.id,
          lat: request.data.from.latitude,
          lng: request.data.from.longitude,
        },
        {
          userID: request.data.user.id,
          lat: request.data.to.latitude,
          lng: request.data.to.longitude,
        },
      ];
      setCenter(calculateCenterMap(list));
      setZoom(calculateZoom(list));
    }

    return () => {
      if (cleanupFunction) {
        cleanupFunction();
      }
    };

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [request]);

  return (
    <RequestStyled>
      <LoadingWrapper
        isLoading={isLoading || !request?.data}
        error={error}
        style={{ height: "100%" }}
      >
        {request?.data && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{request.data.status.name.toUpperCase()}</CardTitle>
                <CardDescription>
                  <ul className="list-disc">
                    <li>
                      {request.data.active
                        ? "Se muestra la ubicacion actual del gruero"
                        : request.data.driver
                        ? "Se muestra la ubicacion donde el gruero acepto la solicitud"
                        : "No se acepto la solicutd"}
                    </li>
                    <li>Ubicacion de origin: rojo</li>
                    <li>Ubicacion de destino: azul</li>
                  </ul>
                </CardDescription>
              </CardHeader>
            </Card>
            <GoogleMap
              drivers={locations}
              origin={{
                userID: "",
                lat: request.data.from.latitude,
                lng: request.data.from.longitude,
              }}
              destination={{
                userID: "",
                lat: request.data.to.latitude,
                lng: request.data.to.longitude,
              }}
              mapConfig={{ center, zoom }}
              setlocSelected={setlocSelected}
            />
          </>
        )}
      </LoadingWrapper>
    </RequestStyled>
  );
};

const RequestStyled = styled.section`
  position: relative;
  height: 100%;
  .request-header {
    display: flex;
    align-items: center;
    svg {
      margin-left: 100px;
    }
  }
`;

const Card = styled(UICard)`
  .add-button {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 10px 20px;
    border-radius: 14pt;
    background-color: ${({ theme }) => theme.colors.primary};
    color: #fff;
    font-size: 0.7em;
  }
`;

export default MapPage;
