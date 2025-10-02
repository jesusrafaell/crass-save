import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SpendingStateProps } from ".";

type ExpenseTypeSelectorProps = {
  data: SpendingStateProps;
  setData: (prev: SpendingStateProps) => void;
};

type TypesProps = {
  id: number;
  name: string;
};
export const expenseTypes: TypesProps[] = [
  { id: 0, name: "Gasolina" },
  { id: 1, name: "Roturas" },
  { id: 2, name: "Recambios" },
];

const ExpenseTypeSelector = ({ data, setData }: ExpenseTypeSelectorProps) => {
  const updateState = (data: SpendingStateProps, newExpenseType: number) => ({
    ...data,
    expenseType: newExpenseType,
  });

  const onChangeSelect = (type: string) => {
    const expenseType = expenseTypes.find((expense) => expense.name === type);
    setData(updateState(data, expenseType?.id || expenseTypes[0].id));
  };

  const getSelectValue = () => {
    const expenseType = expenseTypes.find(
      (expense) => expense.id === data.expenseType
    );
    return expenseType?.name || expenseTypes[0].name;
  };

  return (
    <>
      <Label>Tipo de gasto</Label>
      <Select value={getSelectValue()} onValueChange={onChangeSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona el tipo" />
        </SelectTrigger>
        <SelectContent>
          {expenseTypes.map(({ name }: { name: string }) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default ExpenseTypeSelector;
