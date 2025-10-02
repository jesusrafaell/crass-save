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
import { Button } from "@/components/ui/button";
import styled from "styled-components";
import themes from "@/utils/themes";
import api from "@/api";
import { toast } from "react-toastify";
import { Spinner } from "@nextui-org/react";
import { LuTriangleRight } from "react-icons/lu";

const UploadFile = ({
  companyId,
  refresh,
  close,
}: {
  companyId?: string;
  refresh: () => void;
  close: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const createDriver = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setIsLoading(true);

      await api.post(
        `/api/v1/auth/register-driver/upload-excel/company/${companyId}`,
        formData
      );
      refresh();
      close();
      toast.success("Archivo cargado exitosamente", {
        style: {
          background: themes.light.colors.primary,
        },
      });
    } catch (e) {
      console.log(e);
      toast.error("Hubo un error intentando cargar el archivo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir un archivo con la lista de grueros</CardTitle>
        <CardDescription>
          <div className="flex flex-col gap-2">
            <span>Selecione el archvio (excel, .xlsx, .xls)</span>
            <span>
              Nota: Debera llegarle un correo a cada gruero indicando como
              terminar el registro
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3">
          <div className="space-y-2">
            <Label htmlFor="excelFormat">Formato esperado del archivo:</Label>
            <ExcelFormatTable>
              <thead>
                <tr>
                  <th>
                    <LuTriangleRight />
                  </th>
                  <th>A</th>
                  <th>B</th>
                  <th>C</th>
                  <th>D</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td className="font-bold">Nombre</td>
                  <td className="font-bold">Apellido</td>
                  <td className="font-bold">Correo</td>
                  <td className="font-bold">Telefono</td>
                </tr>
                <tr>
                  <th>2</th>
                  <td>John</td>
                  <td>Doe</td>
                  <td>john.doe@example.com</td>
                  <td>+1234567890</td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Jane</td>
                  <td>Smith</td>
                  <td>jane.smith@example.com</td>
                  <td>+1987654321</td>
                </tr>
                <tr>
                  <th>...</th>
                </tr>
              </tbody>
            </ExcelFormatTable>
          </div>
          <div className="space-y-2">
            <Label htmlFor="idPhoto">Documento</Label>
            <Input
              id="users"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
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
          {isLoading && <Spinner size="sm" />} <span>Subir</span>
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

const ExcelFormatTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
  }
`;

export default UploadFile;
