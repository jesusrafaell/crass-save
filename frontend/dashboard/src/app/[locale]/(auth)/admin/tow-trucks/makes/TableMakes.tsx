"use client";

import {
  Card as UICard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FaPlus } from "react-icons/fa";
import styled from "styled-components";
import useModal from "@/hooks/useModal";
import { IBase } from "@/models";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Spinner } from "@nextui-org/react";
import api from "@/api";
import { toast } from "react-toastify";
import themes from "@/utils/themes";
import { GrUpdate } from "react-icons/gr";

interface TowTrucksTableProps {
  list: IBase[];
  title: string;
  desc: string;
  companyId?: string;
  refresh: () => void;
}

const TableMake = ({ list, title, desc, refresh }: TowTrucksTableProps) => {
  const { Modal, open, ...modalPropsRest } = useModal();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  const [makeUpdate, setMakeUpdate] = useState<IBase | null>(null);

  const handleAdd = async (name: string) => {
    if (name.length < 2) {
      toast.error("La marca debe ser mayor a dos caracteres");
      return;
    }
    try {
      setIsLoading(true);
      await api.post(`/api/v1/assistance/tow-truck/makes`, {
        name: name,
      });
      refresh();
      modalPropsRest.close();
      toast.success("Marca registrada exitosamente", {
        style: {
          background: themes.light.colors.primary,
        },
      });
    } catch (e) {
      console.log(e);
      toast.error("Hubo un error intentando registrada la marca");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (make: IBase) => {
    if (make.name.length < 2) {
      toast.error("La marca debe ser mayor a dos caracteres");
      return;
    }
    try {
      setIsLoading(true);
      await api.put(`/api/v1/assistance/tow-truck/makes/${make.id}`, {
        name: make.name,
      });
      refresh();
      modalPropsRest.close();
      toast.success("Marca modificada exitosamente", {
        style: {
          background: themes.light.colors.primary,
        },
      });
    } catch (e) {
      console.log(e);
      toast.error("Hubo un error intentando modificar la marca");
    } finally {
      setMakeUpdate(null);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{title}</CardTitle>
            <div role="button" className="add-button" onClick={open}>
              <FaPlus fontSize="2em" />
            </div>
          </div>
          <CardDescription>{desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((make) => {
                const { id, name } = make;
                return (
                  <TableRow key={id}>
                    {makeUpdate && makeUpdate.id == id ? (
                      <TableCell>
                        <Input
                          id="name"
                          name="name"
                          placeholder={name}
                          value={makeUpdate.name}
                          onChange={(e) =>
                            setMakeUpdate({
                              ...makeUpdate,
                              name: e.target.value,
                            })
                          }
                        />
                      </TableCell>
                    ) : (
                      <TableCell
                        className="cursor-pointer"
                        onClick={() => {
                          setMakeUpdate(make);
                        }}
                      >
                        {name}
                      </TableCell>
                    )}
                    <TableCell>
                      {makeUpdate && makeUpdate.id == id ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            handleUpdate(makeUpdate!);
                          }}
                        >
                          <GrUpdate className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Modal id="info-to-modal" bodyScroll={false} {...modalPropsRest}>
        <Card>
          <CardHeader>
            <CardTitle>Agregar una marca</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* <div className="grid grid-cols-2 gap-4"> */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nombre"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              style={{ color: "#000" }}
              disabled={isLoading}
              onClick={modalPropsRest.close}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              onClick={() => handleAdd(name)}
            >
              {isLoading ? <Spinner size="sm" /> : "Agregar"}
            </Button>
          </CardFooter>
        </Card>
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

const Card = styled(UICard)`
  color: ${({ theme }) => theme.color};
  background-color: ${({ theme }) => theme.backgroundColor};
  .add-button {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 10px 20px;
    border-radius: 14pt;
    background-color: ${({ theme }) => theme.colors.primary};
    color: #fff;
    font-size: 0.7em;
  }
`;

export default TableMake;
