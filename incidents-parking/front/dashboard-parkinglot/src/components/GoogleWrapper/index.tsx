/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useGeolocation from "@/hooks/useGeolocation";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import React, { useEffect } from "react";
import MapParkings from "../MapParkings";
import { ILocation } from "@/interfaces/globalContext";

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const GoogleWrapper = ({
  markers,
  center,
  setCenter,
  handlePushpinClick,
}: {
  markers: ILocation[];
  center: ILocation;
  setCenter: any;
  handlePushpinClick: (event: google.maps.KmlMouseEvent) => void;
}) => {
  const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = React.useState(15); // initial zoom
  //this hook get my current location with latitude and longitude
  const { position } = useGeolocation();

  useEffect(() => {
    if (position) {
      setCenter({
        lat: position.latitude,
        lng: position.longitude,
      });
    }
  }, [position]);

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    setClicks([...clicks, e.latLng!]);
  };

  const onIdle = (m: google.maps.Map) => {
    // console.log("onIdle", m);
    setZoom(m.getZoom()!);
    // setCenter(center);
  };
  return (
    <div style={{ display: "flex", height: "100%", width: "100%" }}>
      <Wrapper
        apiKey={"AIzaSyCLFlAfcm--iZk8H2onEA-uuV4a3kY5NmI"}
        // apiKey={"AIzaSyAdl49AT_IolKy3C73DmWxjW_pz44QUJX0"}
        render={render}
      >
        <MapParkings
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: "1", height: "600px", width: "9x00px" }}
        >
          {markers.map((mark, i) => (
            <Marker
              key={i}
              onClick={handlePushpinClick}
              position={{ lat: mark.lat, lng: mark.lng }}
            />
          ))}
        </MapParkings>
      </Wrapper>
    </div>
  );
};

export default GoogleWrapper;

interface MarkerProps {
  onClick: (event: google.maps.KmlMouseEvent) => void;
  position: google.maps.LatLngLiteral;
  map?: any;
}

const Marker: React.FC<MarkerProps> = ({ position, map, onClick }) => {
  const [marker, setMarker] = React.useState<google.maps.Marker | null>(null);

  useEffect(() => {
    let cleanupFunction = () => {};

    if (!marker) {
      // console.log(marker);
      const newMarker = new google.maps.Marker({ position, map });
      newMarker.addListener("click", onClick);

      setMarker(newMarker);

      cleanupFunction = () => {
        google.maps.event.clearInstanceListeners(newMarker);
      };
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        cleanupFunction();
        marker.setMap(null);
      }
    };
  }, [position, marker, onClick]);

  return null;
};
