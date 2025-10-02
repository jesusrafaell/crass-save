"use client";

import {
  Card,
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
import { Badge } from "@/components/ui/badge";
import { Button as UIButton } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import useModal from "@/hooks/useModal";
import AddDriver from "./AddTowTruck";
import themes from "@/utils/themes";
import api from "@/api";
import { toast } from "react-toastify";
import { FiUserPlus } from "react-icons/fi";
import { useState } from "react";
import { ITowTruckDriver } from "@/models";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Avatar } from "@nextui-org/react";
import Button from "@/components/common/Button";
import DeleteModal from "@/components/common/Dashboard/DeleteModal";
import SpendingModal from "@/components/common/Dashboard/SpendingModal";
import SelectDriver from "./SelectDriver";
import EditTowTruck from "./EditTowTruck";
import { GrEdit } from "react-icons/gr";
interface TowTrucksTableProps {
  list: ITowTruckDriver[];
  companyId?: string;
  refresh: () => void;
}

const TowTrucksTable = ({ list, companyId, refresh }: TowTrucksTableProps) => {
  const { Modal: ModalAddTowTruck, open, ...modalAddTowTruckRest } = useModal();

  const {
    Modal: ModalEditTowTruck,
    open: openEdit,
    ...modalEditTowTruckRest
  } = useModal();

  const {
    Modal: ModalTowTruckDriver,
    open: openTowTruckDriver,
    ...modalTowTruckDriverRest
  } = useModal();

  const [towTruckSelected, setTowTruckSelected] =
    useState<ITowTruckDriver | null>(null);

  const removeTowTruck = async (towTruckId: string) => {
    try {
      await api.delete(`/api/v1/assistance/tow-truck/${towTruckId}`);
      refresh();
      toast.success("Grua eliminada exitosamente", {
        style: {
          background: themes.light.colors.primary,
        },
      });
    } catch (e) {
      console.log(e);
      toast.error("Hubo un error intentando eliminar la grua");
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Grúas</CardTitle>
            <Button
              text="Agregar Grúa"
              Icon={() => <FaPlus fontSize="1em" />}
              onClick={open}
            />
          </div>
          <CardDescription>Gestiona tus gruas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Gruista</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Tipo de grúa</TableHead>
                <TableHead>Tipo de motor</TableHead>
                <TableHead>Tipo de transmisión</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Pais</TableHead>
                <TableHead>Imagen</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((towTruck) => {
                const {
                  id,
                  year,
                  licensePlate,
                  // policyNumber,
                  imagePath,
                  user,
                  color,
                  country,
                  // weight,
                  make,
                  craneType,
                  engineType,
                  driveTrainType,
                } = towTruck;
                return (
                  <TableRow key={id}>
                    <TableCell
                      className="font-medium"
                      style={{
                        color: user ? "" : "gray",
                      }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild className="cursor-pointer">
                            <span>
                              {user
                                ? `${user.firstName} ${user.lastName}`
                                : "Sin asignar"}
                            </span>
                          </TooltipTrigger>
                          {user ? (
                            <TooltipContent>
                              <div className="flex flex-col">
                                <span>Email: {user?.email}</span>
                                <span>Tlf: {user?.mobile}</span>
                              </div>
                            </TooltipContent>
                          ) : null}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{licensePlate}</TableCell>
                    <TableCell>{year}</TableCell>
                    <TableCell>{make.name}</TableCell>
                    <TableCell>{craneType.name}</TableCell>
                    <TableCell>{engineType.name}</TableCell>
                    <TableCell>{driveTrainType.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="rounded-medium"
                        style={{
                          borderColor: color.hex,
                        }}
                      >
                        {color.name}
                      </Badge>
                    </TableCell>
                    <TableCell>{country.name}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild className="cursor-pointer">
                            <Avatar src={imagePath} className="w-10 h-10" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <Avatar src={imagePath} className="w-60 h-60" />
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <UIButton
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setTowTruckSelected(towTruck);
                                  openTowTruckDriver();
                                }}
                              >
                                <FiUserPlus className="h-4 w-4" />
                                <span className="sr-only">Asignar Gruero</span>
                              </UIButton>
                            </TooltipTrigger>
                            <TooltipContent>Asignar</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <UIButton
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setTowTruckSelected(towTruck);
                                  openEdit();
                                }}
                              >
                                <GrEdit className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </UIButton>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                          <SpendingModal towTruckId={id} />
                          <DeleteModal
                            description={`Se eliminará la grúa con la placa: ${licensePlate}`}
                            onClick={() => removeTowTruck(id)}
                          />
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ModalTowTruckDriver
        id="assign-driver"
        {...modalTowTruckDriverRest}
        isOpen={modalTowTruckDriverRest.isOpen && !!towTruckSelected}
      >
        {towTruckSelected && (
          <SelectDriver
            companyId={companyId}
            towTruck={towTruckSelected}
            refresh={refresh}
            {...modalTowTruckDriverRest}
          />
        )}
      </ModalTowTruckDriver>

      <ModalAddTowTruck
        id="add-towtruck"
        bodyScroll={false}
        {...modalAddTowTruckRest}
      >
        <AddDriver
          companyId={companyId}
          refresh={refresh}
          {...modalAddTowTruckRest}
        />
      </ModalAddTowTruck>

      <ModalEditTowTruck
        id="add-towtruck"
        bodyScroll={false}
        {...modalEditTowTruckRest}
      >
        {towTruckSelected && (
          <EditTowTruck
            towTruckData={towTruckSelected}
            refresh={refresh}
            {...modalEditTowTruckRest}
          />
        )}
      </ModalEditTowTruck>
    </>
  );
};

export default TowTrucksTable;
