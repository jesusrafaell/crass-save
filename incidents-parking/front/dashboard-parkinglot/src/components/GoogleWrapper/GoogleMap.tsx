import useGeolocation from "@/hooks/useGeolocation";
import { ILocation } from "@/interfaces/globalContext";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { CSSProperties, FC, useRef, useEffect, useState } from "react";

const containerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
};

const mapStyles = [
  {
    featureType: "transit",
    elementType: "all",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "labels",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "landscape",
    elementType: "all",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "all",
    stylers: [{ color: "#a3c4f5" }],
  },
  {
    featureType: "all",
    stylers: [
      {
        // hue: "#5649FF",
        saturation: -10,
        lightness: 20,
      },
    ],
  },
];

export interface IMapProps {
  markers: ILocation[];
  center: ILocation;
  setCenter: any;
  handlePushpinClick: (event: google.maps.MapMouseEvent) => void;
}

const GoogleMapComponent: FC<IMapProps> = ({
  markers,
  center,
  setCenter,
  handlePushpinClick,
}) => {
  const mapRef = useRef<google.maps.Map>();

  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  // const [zoom, setZoom] = useState(15); // initial zoom
  const zoom = 15;

  const { position } = useGeolocation();

  useEffect(() => {
    if (position) {
      setCenter({
        lat: position.latitude,
        lng: position.longitude,
      });
    }
  }, [position, setCenter]);

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    setClicks([...clicks, e.latLng!]);
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      options={{ styles: mapStyles, disableDefaultUI: true }}
    >
      {markers.map((m, i) => (
        <Marker
          key={i}
          position={m}
          onClick={(e) => handlePushpinClick(e)}
          label={{
            text: m.name,
            color: "blue",
            className: "mb-10 font-bold text-[14px]",
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
