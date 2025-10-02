import { ILocation, IMapProps } from "@/models";
import { getTypeTruckIcon } from "@/utils/mapUtils";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { CSSProperties, FC, useRef, useEffect } from "react";
import pointBlue from "@/images/point_blue.png";
// import pointRed from "@/images/point_red.png";

const containerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
};

// const mapStyles = [
//   {
//     featureType: "poi",
//     stylers: [
//       {
//         visibility: "off",
//       },
//     ],
//   },
//   {
//     featureType: "all",
//     stylers: [
//       {
//         hue: "#5649FF",
//         saturation: -20,
//         lightness: 10,
//       },
//     ],
//   },
// ];

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
    stylers: [
      {
        visibility: "on",
      },
    ],
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
    featureType: "all",
    stylers: [
      {
        hue: "#5649FF",
        saturation: -20,
        lightness: 10,
      },
    ],
  },
];

const GoogleMapComponent: FC<IMapProps> = ({
  drivers = [],
  origin,
  destination,
  setlocSelected,
  mapConfig,
}) => {
  const { center, zoom } = mapConfig;
  const mapRef = useRef<google.maps.Map>();
  const markerRefs = useRef<Map<string, google.maps.Marker>>(new Map());

  const handleClick = (e: google.maps.MapMouseEvent, location: ILocation) => {
    setlocSelected(location);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: location.lat, lng: location.lng });
    }
  };

  useEffect(() => {
    drivers.forEach((location) => {
      const marker = markerRefs.current.get(location.userID);
      if (marker) {
        animateMarkerTo(marker, location, 1000); // 1000 ms duration
      }
    });
  }, [drivers]);

  const animateMarkerTo = (
    marker: google.maps.Marker,
    to: ILocation,
    duration: number
  ) => {
    const from = marker.getPosition();
    if (!from) return;

    const deltaLat = to.lat - from.lat();
    const deltaLng = to.lng - from.lng();
    const frames = Math.round(duration / 16); // ~60fps
    let step = 0;

    const animate = () => {
      step += 1;
      const progress = Math.min(step / frames, 1);
      const lat = from.lat() + deltaLat * progress;
      const lng = from.lng() + deltaLng * progress;
      marker.setPosition({ lat, lng });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    // <LoadScript googleMapsApiKey={apikey}>
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      options={{ styles: mapStyles }}
    >
      {drivers.map((location) => (
        <Marker
          key={location.userID}
          position={location}
          icon={{
            url: getTypeTruckIcon(),
            scaledSize: new window.google.maps.Size(40, 40),
          }}
          onLoad={(marker) => {
            markerRefs.current.set(location.userID, marker);
          }}
          onClick={(e) => handleClick(e, location)}
        />
      ))}
      {origin && (
        <Marker
          key={origin.userID}
          position={origin}
          onClick={(e) => handleClick(e, origin)}
        />
      )}
      {destination && (
        <Marker
          key={destination.userID}
          position={destination}
          icon={{
            url: pointBlue.src,
            scaledSize: new window.google.maps.Size(30, 30),
          }}
          onClick={(e) => handleClick(e, destination)}
        />
      )}
    </GoogleMap>
    // </LoadScript>
  );
};

export default GoogleMapComponent;
