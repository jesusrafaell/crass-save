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
import { Button } from "@/components/ui/button";
// import api from "@/api";
import { toast } from "react-toastify";
import { Input as InputNext, Spinner } from "@nextui-org/react";
import themes from "@/utils/themes";
import { Input } from "@/components/ui/input";
import { GrUpdate } from "react-icons/gr";
import { ICompanyData } from "@/models";
import { generateSecurePassword } from "@/utils/generatePassword";
import api from "@/api";
import styled from "styled-components";

const AddUserCompany = ({
  company,
  refresh,
  close,
}: {
  company: ICompanyData;
  refresh: () => void;
  close: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const randNum = Math.floor(Math.random() * 101);

  const [user, setUser] = useState({
    firstName: company.name,
    lastName: "Administrador",
    password: generateSecurePassword(9),
    email: `${company.name
      .replace(/\s+/g, "")
      .toLowerCase()}${randNum}@administrador.com`,
    mobile: company.mobile + `${randNum}`,
    photo:
      "https://files-crashsaver.s3.eu-west-3.amazonaws.com/c94284da-1357-461a-bc64-766bf4f3e206/1724299671.jpg",
    utc: " ",
    companyId: company.id,
  });

  const [isCreated, setIsCreated] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = () => {
    const newPassword = generateSecurePassword(9);
    onChange({
      target: { name: "password", value: newPassword },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const addAdminCompany = async () => {
    try {
      setIsLoading(true);
      await api.post(`/api/v1/auth/dashboard/register-admin`, {
        ...user,
      });
      refresh();
      setIsCreated(true);
      toast.success("Usuario creado exitosamente", {
        style: {
          background: themes.light.colors.primary,
        },
      });
    } catch (e) {
      console.log(e);
      toast.error("Hubo un error intentando crear un usuario ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {!isCreated ? "Agregar un usuario" : `Usuario creado exitosamente`}
        </CardTitle>
        <CardDescription>
          {!isCreated
            ? "Completa los siguientes campos para añadir un usuario a la empresa."
            : `Copie el email y la contraseña`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                disabled={isCreated}
                id="firstName"
                name="firstName"
                placeholder="Nombre"
                value={user.firstName}
                onChange={onChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                disabled={isCreated}
                id="lastName"
                name="lastName"
                value={user.lastName}
                placeholder="Apellido"
                onChange={onChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Teléfono</Label>
              <Input
                disabled={isCreated}
                id="mobile"
                type="tel"
                name="mobile"
                value={user.mobile}
                placeholder="Ingresa tu teléfono"
                onChange={onChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Empresa</Label>
              <Input
                disabled
                id="company"
                type="company"
                name="company"
                value={company.name}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <InputNext
              disabled={isCreated}
              id="email"
              type="email"
              name="email"
              value={user.email}
              placeholder="Email"
              onChange={onChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pass" aria-autocomplete="none">
              Contraseña
            </Label>
            <InputNext
              disabled={isCreated}
              onChange={onChange}
              id="password"
              name="password"
              variant="faded"
              value={user.password}
              type="text"
              endContent={
                !isCreated && (
                  <button
                    className="p-0 min-w-0 min-h-0 focus:outline-none self-center"
                    type="button"
                    onClick={handlePasswordChange}
                  >
                    <GrUpdate className="text-xl cursor-pointer ml-2" />
                  </button>
                )
              }
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          style={{
            color: "#000",
            backgroundColor: !isCreated ? "" : "gray",
          }}
          disabled={isLoading}
          onClick={close}
        >
          {!isCreated ? "Cancelar" : "Listo"}
        </Button>
        {!isCreated && (
          <Button
            style={{ backgroundColor: themes.light.colors.primary }}
            type="submit"
            disabled={isLoading}
            onClick={addAdminCompany}
          >
            {isLoading ? <Spinner size="sm" /> : "Agregar"}
          </Button>
        )}
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

export default AddUserCompany;
