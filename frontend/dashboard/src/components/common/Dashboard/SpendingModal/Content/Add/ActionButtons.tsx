import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import themes from "@/utils/themes";
import { Spinner } from "@nextui-org/react";
import { SpendingStateProps } from ".";
import { expenseTypes } from "./ExpenseTypeSelector";
import { dateToUnix } from "@/lib/utils";
import {
  IAuthLayout,
  useAuthLayoutContext,
} from "@/app/[locale]/(auth)/layout";
import { toast } from "react-toastify";
import api from "@/api";
import { addExpense } from "@/api/endpoints";

type ActionButtonsProps = {
  data: SpendingStateProps;
  towTruckId: string;
  close: () => void;
  goToHistory: () => void;
  refreshHistory: () => void;
};

const ActionButtons = ({
  data,
  towTruckId,
  close,
  goToHistory,
  refreshHistory,
}: ActionButtonsProps) => {
  const loggedUser: IAuthLayout | null = useAuthLayoutContext();

  const [isLoading, setIsLoading] = useState(false);

  const createRecord = async () => {
    const { expenseType, currencyType, date, amount, fuelLiters, description } =
      data;
    const isFuel = expenseTypes[expenseType].name === "Gasolina";

    try {
      setIsLoading(true);
      if (amount <= 0) throw new Error("Debes ingresar un monto válido");
      const record = {
        towTruckId,
        companyId: loggedUser?.company?.id,
        expenseType: expenseType + 1,
        unixDate: dateToUnix(date),
        coinId: currencyType,
        amount,
        ...(isFuel ? { fuelLiters } : { repairDescription: description }),
      };
      await api.post(addExpense, record);
      toast.success("Registro creado exitosamente", {
        style: {
          background: themes.light.colors.primary,
        },
      });
      refreshHistory();
      goToHistory();
    } catch (e: unknown) {
      if (e instanceof Error) toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2 p-0 mt-5">
      <Button
        variant="outline"
        style={{ color: "#000" }}
        disabled={isLoading}
        onClick={close}
      >
        Cancelar
      </Button>
      <Button
        style={{ backgroundColor: themes.light.colors.primary }}
        type="submit"
        onClick={createRecord}
        disabled={isLoading}
      >
        {isLoading ? <Spinner size="sm" /> : "Agregar"}
      </Button>
    </div>
  );
};

export default ActionButtons;
