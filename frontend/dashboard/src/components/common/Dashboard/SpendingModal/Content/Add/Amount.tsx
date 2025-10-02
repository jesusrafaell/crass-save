import React, { useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PrefixInput } from "@/components/ui/prefixInput";
import { ICoin } from "@/models";
import { SpendingStateProps } from ".";

type AmountProps = {
  coins: ICoin[];
  data: SpendingStateProps;
  setData: (prev: SpendingStateProps) => void;
};

const Amount = ({ coins, data, setData }: AmountProps) => {
  const updateCurrencyType = (
    data: SpendingStateProps,
    newCurrencyType: string
  ) => ({
    ...data,
    currencyType: newCurrencyType,
  });

  const onChangeSelect = (type: string) => {
    const currencyType = coins.find(({ name }) => name === type);
    setData(updateCurrencyType(data, currencyType?.id || coins[0].id));
  };

  const getSelectValue = () => {
    const currencyType = coins.find(({ id }) => id === data.currencyType);
    return currencyType?.name || coins[0].name;
  };

  const getPrefix = () => {
    const currencyType = coins.find(({ id }) => id === data.currencyType);
    return currencyType?.symbol || coins[0].symbol;
  };

  useEffect(() => {
    if (!!coins) setData(updateCurrencyType(data, coins[0].id));

    //eslint-disable-next-line
  }, [coins]);
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Tipo de moneda</Label>
        <Select value={getSelectValue()} onValueChange={onChangeSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona la divisa" />
          </SelectTrigger>
          <SelectContent>
            {coins.map(({ name }: { name: string }) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Monto</Label>
        <PrefixInput
          id="amount"
          type="number"
          placeholder="Ingresa el monto gastado"
          min={1}
          value={data.amount}
          prefix={getPrefix()}
          onChange={(e) =>
            setData({
              ...data,
              amount: Number(e.target.value),
            })
          }
        />
      </div>
    </div>
  );
};

export default Amount;
