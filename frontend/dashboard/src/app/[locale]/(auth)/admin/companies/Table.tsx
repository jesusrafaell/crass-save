"use client";

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
import { FaMoneyBill, FaPlus } from "react-icons/fa";
import styled from "styled-components";
import useModal from "@/hooks/useModal";
import { ICompanyData } from "@/models";
import { useState } from "react";
import api from "@/api";
import { toast } from "react-toastify";
import themes from "@/utils/themes";
import AddCompany from "./AddCompany";
import { Button } from "@/components/ui/button";
import AddUserCompany from "./AddUserAdmin";
import { FiUserPlus } from "react-icons/fi";

interface CompaniesTableProps {
  list: ICompanyData[];
  title: string;
  desc: string;
  companyId?: string;
  refresh: () => void;
}

const TableCompanies = ({
  list,
  title,
  desc,
  refresh,
}: CompaniesTableProps) => {
  const { Modal, open, ...modalPropsRest } = useModal();
  const {
    Modal: ModalAdmin,
    open: openAdmin,
    ...modalAdminPropsRest
  } = useModal();

  // const [isLoading, setIsLoading] = useState(false);

  // const [companyUpdate, setCompanyUpdate] = useState<ICompanyData | null>(null);

  const [companySelected, setCompanySelected] = useState<ICompanyData | null>(
    null
  );

  // const handleUpdate = async (company: ICompanyData) => {
  //   try {
  //     setIsLoading(true);
  //     await api.put(`/api/v1/assistance/companies/${company.id}`, company);
  //     refresh();
  //     modalPropsRest.close();
  //     toast.success("Empresa modificada exitosamente", {
  //       style: {
  //         background: themes.light.colors.primary,
  //       },
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     toast.error("Hubo un error intentando modificar la empresa");
  //   } finally {
  //     setCompanyUpdate(null);
  //     setIsLoading(false);
  //   }
  // };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{title}</CardTitle>
            <div role="button" className="add-button" onClick={open}>
              <FaPlus fontSize="2em" />
              Agregar
            </div>
          </div>
          <CardDescription>{desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>mobile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nro. Usuarios</TableHead>
                <TableHead>Nro. Drivers</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead>Accions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((company) => {
                const {
                  id,
                  name,
                  email,
                  mobile,
                  active,
                  description,
                  totalDriver,
                  totalUser,
                } = company;
                return (
                  <TableRow key={id} className="cursor-pointer">
                    <TableCell
                    // onClick={() => {
                    //   setCompanyUpdate(company);
                    // }}
                    >
                      {name}
                    </TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>{mobile}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-lg"
                          style={{
                            backgroundColor: active ? "green" : "red",
                          }}
                        />
                        <span>{active ? "Activo" : "Inactivo"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{totalUser || 0}</TableCell>
                    <TableCell>{totalDriver || 0}</TableCell>
                    <TableCell>{description}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCompanySelected(company);
                          openAdmin();
                        }}
                      >
                        <FiUserPlus className="h-4 w-4" />
                        <span className="sr-only">Asignar</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Modal id="info-to-modal" bodyScroll={false} {...modalPropsRest}>
        <AddCompany refresh={refresh} {...modalPropsRest} />
      </Modal>
      <ModalAdmin
        id="assign-admin"
        {...modalAdminPropsRest}
        isOpen={modalAdminPropsRest.isOpen && !!companySelected}
      >
        {companySelected && (
          <AddUserCompany
            company={companySelected}
            refresh={refresh}
            {...modalAdminPropsRest}
          />
        )}
      </ModalAdmin>
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

export default TableCompanies;
