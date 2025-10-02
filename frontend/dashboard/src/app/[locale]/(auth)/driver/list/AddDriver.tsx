import React, { useState } from "react";
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
import { Spinner } from "@nextui-org/react";

const AddDriver = ({
  companyId,
  refresh,
  close,
}: {
  companyId?: string;
  refresh: () => void;
  close: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [driver, setDriver] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    utc: "Colombia/Bogota",
    identification: {
      key: 1,
      path: "https://files-crashsaver.s3.eu-west-3.amazonaws.com/c94284da-1357-461a-bc64-766bf4f3e206/1724299671.jpg",
    },
    photo:
      "https://files-crashsaver.s3.eu-west-3.amazonaws.com/c94284da-1357-461a-bc64-766bf4f3e206/1724299671.jpg",
    companyId,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDriver((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const createDriver = async () => {
    try {
      setIsLoading(true);
      await api.post(`/api/v1/auth/dashboard/register-driver`, driver);
      refresh();
      close();
      toast.success("Gruero creado exitosamente", {
        style: {
          background: themes.light.colors.primary,
        },
      });
    } catch (e) {
      console.log(e);
      toast.error("Hubo un error intentando crear el gruero");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar un gruero</CardTitle>
        <CardDescription>
          Completa los siguientes campos para añadir a un nuevo gruero.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">Nombre</Label>
            <Input
              id="first_name"
              name="first_name"
              placeholder="Ingresa tu nombre"
              onChange={onChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Apellido</Label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Ingresa tu apellido"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Ingresa tu email"
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Teléfono</Label>
          <Input
            id="mobile"
            type="tel"
            name="mobile"
            placeholder="Ingresa tu teléfono"
            onChange={onChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo de Identificación</Label>
            <Select>
              <SelectTrigger style={{ color: "#000" }}>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dni">DNI</SelectItem>
                <SelectItem value="passport">Pasaporte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="idPhoto">Foto del Documento</Label>
            <Input id="idPhoto" type="file" />
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
          className="flex gap-2"
          style={{ backgroundColor: themes.light.colors.primary }}
          type="submit"
          disabled={isLoading}
          onClick={createDriver}
        >
          {isLoading && <Spinner size="sm" />} <span>Agregar Gruero</span>
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

export default AddDriver;
