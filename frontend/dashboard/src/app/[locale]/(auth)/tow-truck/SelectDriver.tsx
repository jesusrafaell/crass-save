import React, { useEffect, useState } from "react";
import {
  Card as UICard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import styled from "styled-components";
import themes from "@/utils/themes";
import api from "@/api";
import { toast } from "react-toastify";
// import { Spinner } from "@nextui-org/react";
import { useFetchData } from "@/hooks/useFetchData";
import { IDriverInfo, ITowTruckDriver } from "@/models";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IoMdRemoveCircle } from "react-icons/io";

interface AssignDriverRequestBody {
  id: string;
  removeDriver?: boolean;
  driverId?: string | null;
}
const SelectDriver = ({
  companyId,
  towTruck,
  refresh,
  close,
}: {
  companyId?: string;
  towTruck: ITowTruckDriver;
  refresh: () => void;
  close: () => void;
}) => {
  // const [isLoading, setIsLoading] = useState(false);
  // const [driver, setDriver] = useState({
  //   id: "",
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   mobile: "",
  // });

  const {
    data,
    error,
    isLoading: isDataLoading,
    refreshData,
  } = useFetchData<{ data: IDriverInfo[] }>(
    `/api/v1/users/all/driver/company/${companyId}`
  );

  const handleDriverToTowTruck = async (
    id: string,
    driverId: string | null
  ) => {
    try {
      const body: AssignDriverRequestBody = { id };

      if (driverId === null) {
        body.removeDriver = true;
      } else {
        body.driverId = driverId;
      }

      await api.post(`/api/v1/assistance/tow-truck/assign-driver`, body);
      refresh();
      toast.success("Gruista asignado exitosamente", {
        style: {
          background: themes.light.colors.primary,
        },
      });
      close();
    } catch (e) {
      console.log(e);
      toast.error("Hubo un error intentando asignar un gruista");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Seleccionar un gruista</CardTitle>
          <Button
            role="button"
            className="flex items-center gap-3 add-button"
            onClick={() => handleDriverToTowTruck(towTruck.id, null)}
            style={{ backgroundColor: themes.light.colors.primary }}
          >
            <IoMdRemoveCircle fontSize="1rem" />
            <span>Desasignar</span>
          </Button>
        </div>
        <CardDescription>
          Selecciona un gruista para asignarle la grua Placa:{" "}
          {`${towTruck?.licensePlate}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {!isDataLoading && data ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map(
                ({
                  id,
                  firstName,
                  lastName,
                  email,
                  mobile,
                  status,
                }: IDriverInfo) => {
                  return (
                    <TableRow
                      key={id}
                      className="cursor-pointer"
                      onClick={() => handleDriverToTowTruck(towTruck.id, id)}
                    >
                      <TableCell className="font-medium">{`${firstName} ${lastName}`}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>{mobile}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="rounded-medium"
                          style={{
                            color: themes.light.colors.primary,
                          }}
                        >
                          {status.name.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        ) : null}
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

export default SelectDriver;
