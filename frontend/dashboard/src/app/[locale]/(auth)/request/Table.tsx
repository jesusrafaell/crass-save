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
import useModal from "@/hooks/useModal";
import { formatTimeElapsed, unixToFormattedDate } from "@/utils/times";
import { FaStar } from "react-icons/fa";
import { IRequestAssistence } from "@/models/request";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CustomLink from "@/components/common/CustomLink";
import { useRouter } from "next/navigation";
interface RequestTableProps {
  list: IRequestAssistence[];
}

const RequestTable = ({ list }: RequestTableProps) => {
  const { Modal, open, ...modalPropsRest } = useModal();
  const router = useRouter();

  const handleRedirect = (id: string) => {
    router.push(`/request/${id}`);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Solicitudes</CardTitle>
          </div>
          <CardDescription>
            Lista de solicitudes aceptadas, completadas o canceladas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Cliente</TableHead>
                <TableHead>Placa Cliente</TableHead>
                <TableHead>Nombre Gruista</TableHead>
                <TableHead>Placa Grua</TableHead>
                <TableHead>Estatus</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild className="cursor-pointer">
                        <span>Dis. Destino/Cliente</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="flex flex-col">
                          <span>
                            Distancia del cliente a la ubicacion selecionada
                          </span>
                          <span>
                            Distancia del gruista a la ubicacion del cliente
                          </span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Puntuación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map(
                ({
                  id,
                  user,
                  driver,
                  vehicle,
                  towTruck,
                  userToDestination,
                  driverToUser,
                  status,
                  price,
                  stars,
                  timeElapsed,
                  acceptedTime,


                  finishTime,
                }) => {
                  return (
                    <TableRow
                      key={id}
                      className="cursor-pointer"
                      onClick={() => handleRedirect(id)}
                    >
                      <TableCell className="font-medium">{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild className="cursor-pointer">
                              <span>{vehicle.licensePlate}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex flex-col">
                                <span>Año : {vehicle.year}</span>
                                <span>Marca: {vehicle.make.name}</span>
                                <span>Modelo: {vehicle.model.name}</span>
                                <span>Tipo: {vehicle.type.name}</span>
                                <span>Motor: {vehicle.engineType.name}</span>
                                <span>Color: {vehicle.color.name}</span>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="font-medium">
                        {driver
                          ? `${driver.firstName} ${driver.lastName}`
                          : "Sin asginar"}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild className="cursor-pointer">
                              <span>
                                {towTruck
                                  ? towTruck.licensePlate
                                  : "No disponible"}
                              </span>
                            </TooltipTrigger>
                            {towTruck ? (
                              <TooltipContent>
                                <div className="flex flex-col">
                                  <span>Año: {towTruck.year}</span>
                                  <span>Marca: {towTruck.make.name}</span>
                                  <span>Tipo: {towTruck.craneType.name}</span>
                                  <span>Color: {towTruck.color.name}</span>
                                </div>
                              </TooltipContent>
                            ) : null}
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="rounded-medium"
                            style={{
                              borderColor:
                                status.key === "completed" ||
                                status.key === "driver_completed"
                                  ? "green"
                                  : status.key === "cancelled"
                                  ? "red"
                                  : "gray",
                            }}
                          >
                            {status.name.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {driver ? `${price.toFixed(2)}$` : "No Disponible"}
                      </TableCell>
                      <TableCell>
                        {userToDestination.toFixed(2)} Metros
                        {" / "}
                        {driverToUser
                          ? `${driverToUser.toFixed(2)} Metros`
                          : "No disponible"}
                      </TableCell>
                      <TableCell>
                        {acceptedTime
                          ? unixToFormattedDate(acceptedTime)
                          : "No disponible"}
                      </TableCell>
                      <TableCell>
                        {finishTime
                          ? unixToFormattedDate(finishTime)
                          : "No disponible"}
                      </TableCell>
                      <TableCell>
                        {formatTimeElapsed(
                          timeElapsed.hours,
                          timeElapsed.minutes,
                          timeElapsed.seconds
                        )}
                      </TableCell>
                      <TableCell className="flex items-center">
                        {stars ? <StarRating stars={stars} /> : ""}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* <Modal
        id="info-to-modal"
        bodyScroll={false}
        {...modalPropsRest}
      >
      </Modal> */}
    </>
  );
};

interface StarRatingProps {
  stars: number;
  maxStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ stars, maxStars = 5 }) => {
  return (
    <span className="inline-flex">
      {[...Array(maxStars)].map((_, index) => (
        <FaStar
          key={index}
          color={index < stars ? "#FEC810" : "gray"}
          style={{ marginRight: "1px" }}
        />
      ))}
    </span>
  );
};

function TrashIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

export default RequestTable;
