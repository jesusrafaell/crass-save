"use client";
import { useState } from "react";
import {
  Card as UICard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import styled from "styled-components";
import themes from "@/utils/themes";
import api from "@/api";
import { toast } from "react-toastify";
import { Image, Spinner } from "@nextui-org/react";
import { useFetchData } from "@/hooks/useFetchData";
import { IBase, ITowTruckDriver } from "@/models";

interface IFetch {
  data: IBase[];
}

const EditTowTruck = ({
  towTruckData,
  refresh,
  close,
}: {
  towTruckData: ITowTruckDriver;
  refresh: () => void;
  close: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [towTruck, setTowTruck] = useState({
    year: towTruckData.year,
    licensePlate: towTruckData.licensePlate,
    imagePath: towTruckData.imagePath,
    policyNumber: towTruckData.policyNumber,
    engineTypeId: towTruckData.engineType.id,
    makeId: towTruckData.make.id,
    colorId: towTruckData.color.id,
    driveTrainTypeId: towTruckData.driveTrainType.id,
    weightID: towTruckData.weight.id,
    craneTypeId: towTruckData.craneType.id,
    countryId: towTruckData.country.id,
    insuranceId: towTruckData.insurance.id,
  });

  const [photo, setPhoto] = useState<File | null>(null);

  const {
    data: listMakes,
    error: eMakes,
    isLoading: isLoadingMake,
    refreshData: rMake,
  } = useFetchData<IFetch>(`/api/v1/assistance/tow-truck/makes`);

  const {
    data: listColors,
    error: eColors,
    isLoading: isLoadingColors,
    refreshData: rColors,
  } = useFetchData<IFetch>(`/api/v1/assistance/colors`);

  const {
    data: listWeights,
    error: eWeights,
    isLoading: isLoadingWeights,
    refreshData: rWeights,
  } = useFetchData<IFetch>(`/api/v1/assistance/weights`);

  const {
    data: listCraneTypes,
    error: eCraneTypes,
    isLoading: isLoadingCraneTypes,
    refreshData: rCraneTypes,
  } = useFetchData<IFetch>(`/api/v1/assistance/crane-types`);

  const {
    data: listInsurances,
    error: eInsurances,
    isLoading: isLoadingInsurances,
    refreshData: rInsurances,
  } = useFetchData<IFetch>(`/api/v1/assistance/insurances`);

  const {
    data: listCountries,
    error: eCountries,
    isLoading: isLoadingCountries,
    refreshData: rCountries,
  } = useFetchData<IFetch>(`/api/v1/assistance/countries`);

  const {
    data: listDriveTrainTypes,
    error: eDriveTrainTypes,
    isLoading: isLoadingDriveTrainTypes,
    refreshData: rDriveTrainTypes,
  } = useFetchData<IFetch>(`/api/v1/assistance/drive-train-types`);

  const {
    data: listEngineTypes,
    error: eEngineTypes,
    isLoading: isLoadingEngineTypes,
    refreshData: rEngineTypes,
  } = useFetchData<IFetch>(`/api/v1/assistance/engine-type`);

  const createTowTruck = async () => {
    try {
      setIsLoading(true);
      await api.post("/api/v1/assistance/tow-truck/company", towTruck);
      refresh();
      close();
      toast.success("Grúa creada exitosamente", {
        style: {
          background: themes.light.colors.primary,
        },
      });
    } catch (e) {
      console.log(e);
      toast.error("Hubo un error intentando añadir la grúa");
    } finally {
      setIsLoading(false);
    }
  };

  const isLoadingData = () => {
    if (
      !isLoadingMake &&
      !isLoadingColors &&
      !isLoadingWeights &&
      !isLoadingCraneTypes &&
      !isLoadingInsurances &&
      !isLoadingCountries &&
      !isLoadingDriveTrainTypes &&
      !isLoadingEngineTypes
    )
      return false; //false
    return true;
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Editar Grúa</CardTitle>
        <CardDescription>Puedes editar los siguientes campos.</CardDescription>
      </CardHeader>
      {isLoadingData() && (
        <Spinner
          size="lg"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      )}
      <CardContent
        className="space-y-4"
        style={{ opacity: isLoadingData() ? 0 : 1 }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Año</Label>
            <Input
              id="year"
              type="number"
              placeholder="Ingresa el año"
              min={1800}
              max={2024}
              value={towTruck.year}
              onChange={(e) =>
                setTowTruck({ ...towTruck, year: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensePlate">Placa</Label>
            <Input
              id="licensePlate"
              type="text"
              placeholder="Ingresa la placa"
              value={towTruck.licensePlate}
              onChange={(e) =>
                setTowTruck({ ...towTruck, licensePlate: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insuranceId">Seguro</Label>
            <Select
              value={towTruck.insuranceId}
              onValueChange={(insuranceId) =>
                setTowTruck({ ...towTruck, insuranceId })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el seguro" />
              </SelectTrigger>
              <SelectContent>
                {listInsurances &&
                  listInsurances.data.map(
                    ({ id, name }: { id: string; name: string }) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="policyNumber">Número de póliza</Label>
            <Input
              id="policyNumber"
              type="text"
              placeholder="Ingresa el número de póliza"
              value={towTruck.policyNumber}
              onChange={(e) =>
                setTowTruck({ ...towTruck, policyNumber: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="engineTypeId">Tipo de motor</Label>
            <Select
              value={towTruck.engineTypeId}
              onValueChange={(engineTypeId) =>
                setTowTruck({ ...towTruck, engineTypeId })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                {listEngineTypes &&
                  listEngineTypes.data.map(
                    ({ id, name }: { id: string; name: string }) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="makeId">Marca</Label>
            <Select
              value={towTruck.makeId}
              onValueChange={(makeId) => setTowTruck({ ...towTruck, makeId })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la marca" />
              </SelectTrigger>
              <SelectContent>
                {listMakes &&
                  listMakes.data.map(
                    ({ id, name }: { id: string; name: string }) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="driveTrainTypeId">Tipo de transmisión</Label>
            <Select
              value={towTruck.driveTrainTypeId}
              onValueChange={(driveTrainTypeId) =>
                setTowTruck({ ...towTruck, driveTrainTypeId })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                {listDriveTrainTypes &&
                  listDriveTrainTypes.data.map(
                    ({ id, name }: { id: string; name: string }) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="craneTypeId">Tipo de grúa</Label>
            <Select
              value={towTruck.craneTypeId}
              onValueChange={(craneTypeId) =>
                setTowTruck({ ...towTruck, craneTypeId })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                {listCraneTypes &&
                  listCraneTypes.data.map(
                    ({ id, name }: { id: string; name: string }) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2">
            <Label htmlFor="weightID">Peso</Label>
            <Select
              value={towTruck.weightID}
              onValueChange={(weightID) =>
                setTowTruck({ ...towTruck, weightID })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el peso" />
              </SelectTrigger>
              <SelectContent>
                {listWeights &&
                  listWeights.data.map(
                    ({ id, name }: { id: string; name: string }) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="colorId">Color</Label>
            <Select
              value={towTruck.colorId}
              onValueChange={(colorId) => setTowTruck({ ...towTruck, colorId })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el color" />
              </SelectTrigger>
              <SelectContent>
                {listColors &&
                  listColors.data.map(
                    ({ id, name }: { id: string; name: string }) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="countryId">País</Label>
            <Select
              value={towTruck.countryId}
              onValueChange={(countryId) =>
                setTowTruck({ ...towTruck, countryId })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el país" />
              </SelectTrigger>
              <SelectContent>
                {listCountries &&
                  listCountries.data.map(
                    ({ id, name }: { id: string; name: string }) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* <div className="space-y-2 flex w-full justify-between"> */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 flex justify-center">
            <Image
              width={150}
              height={150}
              className="max-w-full max-h-full object-contain"
              style={{ width: "150px", height: "150px" }}
              alt={towTruck.licensePlate}
              src={towTruck.imagePath}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imagePath">Foto</Label>
            <Input
              id="imagePath"
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];
                  setPhoto(file);
                  setTowTruck({
                    ...towTruck,
                    imagePath: URL.createObjectURL(file),
                  });
                }
              }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          style={{ color: "#000" }}
          disabled={isLoading}
          onClick={close}
        >
          Cancelar
        </Button>
        <Button
          style={{ backgroundColor: themes.light.colors.primary }}
          type="submit"
          onClick={createTowTruck}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Editar Grua"}
        </Button>
      </CardFooter>
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

export default EditTowTruck;
