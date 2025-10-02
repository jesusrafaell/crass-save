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
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button as UIButton } from "@/components/ui/button";
import Button from "@/components/common/Button";
import { FaPlus } from "react-icons/fa";
import useModal from "@/hooks/useModal";
import AddDriver from "./AddDriver";
import themes from "@/utils/themes";
import api from "@/api";
import { toast } from "react-toastify";
import DeleteModal from "@/components/common/Dashboard/DeleteModal";
import UploadFile from "./UploadFile";

interface List {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  status: {
    key: string;
    name: string;
  };
  online: boolean;
}
interface DriversTableProps {
  list: List[];
  companyId?: string;
  refresh: () => void;
}

const DriversTable = ({ list, companyId, refresh }: DriversTableProps) => {
  const { Modal, open, ...modalPropsRest } = useModal();
  const {
    Modal: ModelFile,
    open: openFile,
    ...modalPropsRestFile
  } = useModal();

  const removeDriver = async (userId: string) => {
    try {
      await api.put(`/api/v1/auth/dashboard/remove-account/${userId}`);
      refresh();
      toast.success("Gruero eliminado exitosamente", {
        style: {
          background: themes.light.colors.primary,
        },
      });
    } catch (e) {
      console.log(e);
      toast.error("Hubo un error intentando eliminar el gruero");
    }
  };
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Grueros</CardTitle>
            <div className="flex flex-col gap-2">
              <Button
                text="Agregar gruero"
                Icon={() => <FaPlus fontSize="1em" />}
                onClick={open}
              />
              <Button
                text="Importar Doc."
                Icon={() => <FaPlus fontSize="1em" />}
                onClick={openFile}
              />
            </div>
          </div>
          <CardDescription>
            Gestiona a los grueros y sus estados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado en línea</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map(
                ({
                  id,
                  firstName,
                  lastName,
                  email,
                  mobile,
                  status,
                  online,
                }) => {
                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">{`${firstName} ${lastName}`}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>{mobile}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-lg"
                            style={{
                              backgroundColor: online ? "green" : "red",
                            }}
                          />
                          <span>{online ? "En línea" : "Desconectado"}</span>
                        </div>
                      </TableCell>
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <DeleteModal
                              description={`Se eliminará el gruero: ${firstName} ${lastName}`}
                              onClick={() => removeDriver(id)}
                            />
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Modal id="add-driver" {...modalPropsRest}>
        <AddDriver
          companyId={companyId}
          refresh={refresh}
          {...modalPropsRest}
        />
      </Modal>
      <Modal id="upload-file" {...modalPropsRestFile}>
        <UploadFile
          companyId={companyId}
          refresh={refresh}
          {...modalPropsRestFile}
        />
      </Modal>
    </>
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

export default DriversTable;
