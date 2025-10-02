"use client";
import { useState } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import styled from "styled-components";
import themes from "@/utils/themes";
// import api from "@/api";
// import { toast } from "react-toastify";
// import { Image, Spinner } from "@nextui-org/react";
import { useFetchData } from "@/hooks/useFetchData";
import { IBase, ICoin, ITypeRatePrice } from "@/models";
import { Spinner } from "@nextui-org/react";
// import { formatPrice } from "@/utils/priceFormat";

interface IFetch {
  data: IBase[];
}

const EditRate = ({
  rate,
  coins,
  refresh,
  close,
}: {
  rate: ITypeRatePrice;
  coins: ICoin[];
  refresh: () => void;
  close: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: listCoins,
    error: eCoins,
    isLoading: isLoadingCoins,
    refreshData: rCoins,
  } = useFetchData<{ data: ICoin }>(`/api/v1/assistance/tow-truck/makes`);

  const [prices, setPrices] = useState(rate.prices);
  const [coin, setCoin] = useState<ICoin | null>(rate.prices[0].coin);

  const createTowTruck = async () => {};

  const isLoadingData = () => {
    if (!isLoadingCoins) return false; //false
    return true;
  };

  const getSelectValue = () => {
    const currencyType = coins.find(({ id }) => id === coin?.id);
    return currencyType?.name || coins[0].name;
  };

  const onChangeSelect = (type: string) => {
    const currencyType = coins.find(({ name }) => name === type);
    setCoin(currencyType || prices[0].coin);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarifa de {rate.type.name}</CardTitle>
        <CardDescription>Puedes editar los siguientes campos.</CardDescription>
      </CardHeader>
      {isLoadingData() && (
        <Spinner
          size="lg"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      )}
      <CardContent
        className="space-y-4 px-10"
        style={{ opacity: isLoadingData() ? 0 : 1 }}
      >
        <div className="space-y-4">
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
          {prices.map((p, i) => {
            return (
              <div key={p.id} className="grid grid-cols-1 gap-4">
                <div key={p.id} className="space-y-2">
                  <Label htmlFor={p.key}>{p.km} km</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="Ingresa Precio"
                    min={1800}
                    max={2024}
                    value={p.priceKm}
                    onChange={(e) => {
                      const updatedPrices = [...prices];
                      updatedPrices[i].priceKm = Number(e.target.value);
                      setPrices(updatedPrices);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2">
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
          onClick={createTowTruck}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Editar"}
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

export default EditRate;
