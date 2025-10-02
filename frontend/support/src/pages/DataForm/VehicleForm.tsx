import Input from "../../components/Form/Input";
import CustomSelect from "../../components/Form/CustomSelect";
import { FormDataProps, OptionProps } from "./model";
import { useFetchData } from "../../hooks/useFetchData";
import { useMemo } from "react";

const VehicleForm = ({
  data,
  formSelectData,
  vehicleSelected,
  setVehicleSelected,
  setData,
}: FormDataProps & {
  formSelectData: { [key: string]: any };
  vehicleSelected: string;
  setVehicleSelected: (v: string) => void;
}) => {
  const vehicleIndex = useMemo(
    () => data.vehicles.findIndex(({ id }) => id === vehicleSelected),
    [vehicleSelected]
  );

  const { data: models } = useFetchData<OptionProps[]>(
    `api/v1/assistance/models?makeId=${data.vehicles[vehicleIndex].make.id}`,
    !!data.vehicles[vehicleIndex].make.id
  );

  const handleSelect = (key: string) => (value: OptionProps) => {
    setData({
      ...data,
      vehicles: data.vehicles.map((v) => {
        if (v.id !== vehicleSelected) return v;
        if (key === "make")
          return { ...v, make: value, model: { id: "", name: "" } };
        return { ...v, [key]: value };
      }),
    });
  };

  const onChangeVehicle = ({ id }: OptionProps) => setVehicleSelected(id);

  const vehicle = data.vehicles[vehicleIndex];

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>Formulario del vehículo</h2>
        {data.vehicles && data.vehicles.length > 1 && (
          <div style={{ marginTop: 20, paddingRight: 40 }}>
            <CustomSelect
              label="Selecciona la placa del vehículo a editar"
              options={data.vehicles.map(({ id, licensePlate }) => ({
                id,
                name: licensePlate,
              }))}
              selected={{
                id: vehicle.id,
                name: vehicle.licensePlate,
              }}
              onChange={onChangeVehicle}
            />
          </div>
        )}
        <form>
          <Input
            label="Placa"
            type="text"
            value={vehicle.licensePlate.toString()}
            name="licensePlate"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setData({
                ...data,
                vehicles: data.vehicles.map((v) => {
                  if (v.id !== vehicleSelected) return v;
                  return { ...v, [e.target.name]: e.target.value };
                }),
              })
            }
          />
          <CustomSelect
            label="Color"
            after="color"
            options={formSelectData.colors}
            selected={vehicle.color}
            onChange={handleSelect("color")}
          />
          <CustomSelect
            label="Tipo de carro"
            options={formSelectData.types}
            selected={vehicle.type}
            onChange={handleSelect("type")}
          />
          <CustomSelect
            label="Tipo de tracción"
            options={formSelectData.driveTrainTypes}
            selected={vehicle.driveTrainType}
            onChange={handleSelect("driveTrainType")}
          />
          <CustomSelect
            label="Tipo de motor"
            options={formSelectData.engineTypes}
            selected={vehicle.engineType}
            onChange={handleSelect("engineType")}
          />
          <CustomSelect
            label="Peso"
            options={formSelectData.weights}
            selected={vehicle.weight}
            onChange={handleSelect("weight")}
          />
          <CustomSelect
            label="País"
            options={formSelectData.countries}
            selected={vehicle.country}
            onChange={handleSelect("country")}
          />
          <CustomSelect
            label="Seguros"
            options={formSelectData.insurances}
            selected={vehicle.insurance}
            onChange={handleSelect("insurance")}
          />
          <CustomSelect
            label="Marca"
            options={formSelectData.makes}
            selected={vehicle.make}
            onChange={handleSelect("make")}
          />
          <CustomSelect
            label="Modelo"
            options={models}
            selected={vehicle.model}
            disabled={!vehicle.make.id}
            onChange={handleSelect("model")}
          />
          <Input
            label="Foto del vehículo"
            type="file"
            accept="image/*"
            containerStyle={{ gridColumn: "1 / -1" }}
            style={{ fontSize: ".8em", marginBottom: 30 }}
          />
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
