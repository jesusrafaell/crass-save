import React from "react";
import { Card as UICard, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import styled from "styled-components";
import { IExpenseRecord } from "@/models";
import { expenseTypes } from "../Add/ExpenseTypeSelector";

type RecordHistoryProps = {
  history: IExpenseRecord[];
  isLoading: boolean;
  error: any;
};

const RecordHistory = ({ history }: RecordHistoryProps) => {
  return (
    <Card className="p-0">
      <CardContent className="grid gap-4 p-0">
        {!!history && (
          <Table className="p-0">
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo de gasto</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Listros de gasolina</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map(
                (
                  {
                    id,
                    expenseType,
                    coin,
                    amount,
                    fuelLiters,
                    repairDescription,
                    unixDate,
                  },
                  i
                ) => {
                  const date = new Date(unixDate * 1000);
                  return (
                    <TableRow key={id} className="cursor-pointer ">
                      <TableCell>{date.toLocaleDateString()}</TableCell>
                      <TableCell>
                        {expenseTypes[expenseType - 1].name}
                      </TableCell>
                      <TableCell>{`${coin.symbol} ${amount}`}</TableCell>
                      <TableCell className={fuelLiters ? "" : "text-center"}>
                        {fuelLiters ? fuelLiters : "-"}
                      </TableCell>
                      <TableCell
                        className={repairDescription ? "" : "text-center"}
                      >
                        {repairDescription ? repairDescription : "-"}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

const Card = styled(UICard)`
  max-width: none;
  padding: 0 !important;
  border: none;
  box-shadow: unset;
  input {
    color: #000;
  }
`;

export default RecordHistory;
