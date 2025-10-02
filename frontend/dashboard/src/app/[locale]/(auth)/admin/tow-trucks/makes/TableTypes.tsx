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
import { IBaseLang } from "@/models";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Spinner } from "@nextui-org/react";
import { GrUpdate } from "react-icons/gr";
import { toast } from "react-toastify";
import api from "@/api";
import themes from "@/utils/themes";

interface TowTrucksTableProps {
  list: IBaseLang[];
  title: string;
  desc: string;
  handleDelete: () => void;
  companyId?: string;
  refresh: () => void;
}

const TableTypes = ({
  list,
  title,
  desc,
  handleDelete,
  refresh,
}: TowTrucksTableProps) => {
  const { Modal, open, ...modalPropsRest } = useModal();

  const [isLoading, setIsLoading] = useState(false);
  const [craneType, setCraneType] = useState({
    es: "",
    en: "",
  });

  const handleAdd = async ({ en, es }: { en: string; es: string }) => {
    if (en.length < 2 || es.length < 2) {
      toast.error("Los nombres deben ser mayor a dos caracteres");
      return;
    }
    try {
      setIsLoading(true);
      await api.post(`/api/v1/assistance/crane-types`, {
        en,
        es,
      });
      refresh();
      modalPropsRest.close();
      toast.success("Tipo de grua registrada exitosamente", {
        style: {
          background: themes.light.colors.primary,
        },
      });
    } catch (e) {
      console.log(e);
      toast.error("Hubo un error intentando registrada el tipo de grua");
    } finally {
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
                <TableHead>Espanol</TableHead>
                <TableHead>Ingles</TableHead>
                <TableHead>Accions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((towTruck) => {
                const { id, es, en } = towTruck;
                return (
                  <TableRow key={id}>
                    <TableCell>{es}</TableCell>
                    <TableCell>{en}</TableCell>
                    <TableCell>
                      {/* 
                      {craneTypeUpdate && craneTypeUpdate.id == id ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            handleUpdate(craneTypeUpdate!);
                          }}
                        >
                          <GrUpdate className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      ) : null}
                        */}
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
            <CardTitle>Nuevo tipo de grua</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (EN)</Label>
              <Input
                id="en"
                name="en"
                placeholder="Nombre en ingles"
                onChange={(e) => {
                  setCraneType({
                    ...craneType,
                    en: e.target.value,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre (ES)</Label>
              <Input
                id="es"
                name="es"
                placeholder="Nombre en espanol "
                onChange={(e) => {
                  setCraneType({
                    ...craneType,
                    es: e.target.value,
                  });
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
              onClick={() => handleAdd(craneType)}
            >
              {isLoading ? <Spinner size="sm" /> : "Agregar"}
            </Button>
          </CardFooter>
        </Card>
      </Modal>
    </>
  );
};

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

export default TableTypes;
