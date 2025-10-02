import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import api from "@/api";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countries, ICountry } from "@/utils/contries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card as UICard,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import styled from "styled-components";
import { Checkbox, select } from "@nextui-org/react";

const containerStyle = {
  width: "100%",
  height: "400px", // Ajusta el tamaño del mapa según sea necesario
};

const mapStyles = [
  {
    featureType: "poi",
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

const AddCompany = ({
  refresh,
  close,
}: {
  refresh: () => void;
  close: () => void;
}) => {
  const [company, setCompany] = useState({
    name: "",
    email: "",
    description: "",
    mobile: "",
  });

  const [coordinates, setCoordinates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  const mapRef = useRef<google.maps.Map>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          setCompany((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
        },
        (error) => {
          setSelectedLocation({ lat: 0, lng: 0 });
        }
      );
    } else {
      // Si no hay soporte para geolocalización
      setSelectedLocation({ lat: 0, lng: 0 });
    }
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onChangeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLocation((prev) => ({
      ...prev,
      [e.target.name]: Number(e.target.value),
    }));
  };

  // Función para manejar el clic en el mapa y actualizar la ubicación seleccionada
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setSelectedLocation(location); // Actualizar la ubicación seleccionada
      setCompany((prev) => ({
        ...prev,
        latitude: location.lat,
        longitude: location.lng,
      }));
    }
  };

  const [country, setCountry] = useState<ICountry | null>(null);

  const handleCountryChange = (e: string) => {
    const selectedCountry = countries.find((country) => country.name === e);
    if (selectedCountry) {
      setCountry(selectedCountry);
      setSelectedLocation({
        lat: selectedCountry.lat,
        lng: selectedCountry.lng,
      });
      // setCompany({
      //   ...company,
      //   latitude: selectedCountry.lat,
      //   longitude: selectedCountry.lng,
      // });
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Función para crear la compañía
  const createCompany = async () => {
    if (
      selectedLocation.lat == 0 ||
      selectedLocation.lng == 0 ||
      company.name.trim().length < 1 ||
      !emailRegex.test(company.email) ||
      company.mobile.trim().length < 3
    ) {
      toast.error("Debe ingresar todos los campos solicitados");
      return;
    }
    try {
      setIsLoading(true);
      await api.post("/api/v1/assistance/companies", {
        ...company,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
      });
      toast.success("Empresa creada exitosamente");
    } catch (error) {
      toast.error("Hubo un error intentando crear una empresa");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear una Empresa</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="space-y-2">
          <Label>Nombre</Label>
          <Input name="name" value={company.name} onChange={onChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" value={company.email} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input name="mobile" value={company.mobile} onChange={onChange} />
          </div>
        </div>
        <div>
          <Label>Descripción</Label>
          <Input
            name="description"
            value={company.description}
            onChange={onChange}
          />
        </div>
        <Checkbox isSelected={coordinates} onValueChange={setCoordinates}>
          Ingresar Coordenadas
        </Checkbox>
        <div className="h-20">
          {coordinates ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitud</Label>
                <Input
                  type="number"
                  name="lat"
                  value={selectedLocation.lat}
                  onChange={onChangeLocation}
                />
              </div>
              <div className="space-y-2">
                <Label>Longitud</Label>
                <Input
                  type="number"
                  name="lng"
                  value={selectedLocation.lng}
                  onChange={onChangeLocation}
                />
              </div>
            </div>
          ) : (
            <div>
              <Label>Selecciona un país</Label>
              <Select
                value={country?.name}
                onValueChange={(e) => handleCountryChange(e)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el pais" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={selectedLocation} // Centrar el mapa en la ubicación seleccionada
            zoom={7}
            onClick={handleMapClick} // Capturar clic en el mapa
            onLoad={(map) => {
              mapRef.current = map;
            }}
            options={{ styles: mapStyles }}
          >
            {/* Colocar marcador en la ubicación seleccionada */}
            {selectedLocation && (
              <Marker
                position={selectedLocation}
                // icon={{
                //   scaledSize: new window.google.maps.Size(30, 30),
                // }}
              />
            )}
          </GoogleMap>
        </div>
        <Button onClick={createCompany} disabled={isLoading}>
          {isLoading ? "Creando..." : "Crear Empresa"}
        </Button>
      </CardContent>
    </Card>
  );
};

const Card = styled(UICard)`
  max-width: none;
  border: none;
  box-shadow: unset;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.color};
  input {
    color: #000;
  }
`;

export default AddCompany;
