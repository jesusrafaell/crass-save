/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import GlobalContext from "@/context/Global";
import { ILocation, IParking } from "@/interfaces/globalContext";
import { capitalize } from "@mui/material";

import CreateBookingModal from "@/components/modal/CreateBookingModal";
import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { FC, useContext, useState } from "react";
import Select, { StylesConfig } from "react-select";
import GoogleMapComponent from "@/components/GoogleWrapper/GoogleMap";
import { LoadScript } from "@react-google-maps/api";

const CreateBooking: FC = () => {
  const t5 = useTranslations("createBooking");
  const [isCreateBookingOpen, setIsCreateBookingOpen] = useState(false);
  const { parkings } = useContext(GlobalContext);
  //ui values
  const [parkingOpt, setParkingOpt] = useState<IParking | null>(null);
  const [countryOpt, setCountryOpt] = useState<any>(null);
  const [center, setCenter] = useState<ILocation>({
    lat: 0,
    lng: 0,
    name: "",
  });

  const uniqueCountries = new Set(parkings.map((parking) => parking.country));
  const countriesOptions = Array.from(uniqueCountries).map((country) => ({
    value: country,
    label: country,
  }));

  function getParkingByLatLng(lat: number, lng: number) {
    return parkings.find(
      (parking) => parking.latitude === lat && parking.longitude === lng
    );
  }

  const onChangeCountriesSelect = (item: any) => {
    if (item) {
      setCountryOpt(item.value);
      setParkingOpt(null);
    }
  };
  const onChangeParkingSelect = (item: any): void => {
    if (item) {
      setParkingOpt(item);
      setCenter({
        lat: item?.latitude,
        lng: item?.longitude,
        name: "",
      });
    }
  };

  const handlePushpinClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const parking = getParkingByLatLng(
        event.latLng.lat(),
        event.latLng.lng()
      );
      if (parking) {
        setCountryOpt(parking.country);
        onChangeParkingSelect({
          ...parking,
          label: parking.name,
          value: parking.id,
        });
        setIsCreateBookingOpen(true);
      }
    }
  };

  function getParkingsByCountry(selectedCountry: string) {
    // Filtramos los parkings por el país seleccionado
    const filteredParkings = parkings.filter(
      (parking) => parking.country === selectedCountry
    );

    // Transformamos los parkings filtrados para ser usados en el segundo select
    const parkingsOptions: IParking[] = filteredParkings.map((parking) => ({
      ...parking,
      value: parking.id,
      label: parking.name,
    }));

    return parkingsOptions;
  }

  const customStyles: StylesConfig = {
    control: (provided) => ({
      ...provided,
      display: "flex",
      border: "1px solid #4a5568",
      boxShadow: "none",
      borderRadius: "0.375rem",
      padding: "0.5rem 1rem",
      fontSize: "1rem",
      lineHeight: "1.5",
      color: "#f7fafc",
      backgroundColor: "#1a202c",
      "&:hover": {
        borderColor: "#0070f3",
      },
      "&:focus": {
        borderColor: "#0070f3",
        boxShadow: "0 0 0 1px #0070f3",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#0070f3" : "#1a202c",
      color: state.isFocused ? "white" : "#f7fafc",
      padding: "0.5rem 1rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#f7fafc",
    }),
  };

  return (
    <LoadScript googleMapsApiKey={"AIzaSyCLFlAfcm--iZk8H2onEA-uuV4a3kY5NmI"}>
      <div className="flex flex-col w-[900px] gap-10 items-centera min-h-[100vh]">
        <div className="flex w-full gap-3 items-center">
          <div className="flex w-full">
            <Select
              styles={customStyles}
              className="w-full bg-black text-slate-400"
              onChange={onChangeCountriesSelect}
              value={
                countryOpt && {
                  label: countryOpt,
                  value: countryOpt,
                }
              }
              options={countriesOptions}
            />
          </div>
          <div className="flex w-full">
            {countryOpt && (
              <Select
                styles={customStyles}
                className="w-full"
                onChange={onChangeParkingSelect}
                options={getParkingsByCountry(countryOpt)}
                value={
                  parkingOpt && {
                    value: parkingOpt.id,
                    label: parkingOpt.name,
                  }
                }
              />
            )}
          </div>
          <div className="flex w-full">
            {parkingOpt && (
              <Button
                size="lg"
                color="success"
                className=" mx-auto w-full "
                onClick={() => setIsCreateBookingOpen(true)}
              >
                {capitalize(t5("create"))}
              </Button>
            )}
          </div>
          {parkingOpt && (
            <CreateBookingModal
              parking={parkingOpt}
              isOpen={isCreateBookingOpen}
              onClose={() => setIsCreateBookingOpen(false)}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
          }}
        >
          <div style={{ flexGrow: "1", height: "600px", width: "9x00px" }}>
            <GoogleMapComponent
              setCenter={setCenter}
              center={center}
              markers={parkings.map((p) => ({
                lat: p.latitude,
                lng: p.longitude,
                name: p.name,
              }))}
              handlePushpinClick={handlePushpinClick}
            />
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default CreateBooking;
