import React, { useState, useEffect } from "react";

function useGeolocation() {
  const [position, setPosition] = useState<any>({
    latitude: 51.116835083048564,
    longitude: 1.302891821685872,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  return { position };
}
export default useGeolocation;
