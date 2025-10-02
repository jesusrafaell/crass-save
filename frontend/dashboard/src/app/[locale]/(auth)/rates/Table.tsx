"use client";

import React from "react";
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
import useModal from "@/hooks/useModal";
import {
  ICoin,
  IPriceRate,
  ITypeRatePrice,
  ITypeRatePriceTable,
} from "@/models";
import { formatPrice } from "@/utils/priceFormat";
import EditRate from "./EditRate";

interface FeesTableProps {
  data: ITypeRatePriceTable;
  companyId?: string;
  refresh: () => void;
  coins: ICoin[];
}

const RatesTable = ({ data, companyId, refresh, coins }: FeesTableProps) => {
  const { Modal, open, ...modalRest } = useModal();

  const kms = React.useMemo(() => {
    const keys = data.keysKm.map((km) => {
      if (km == 5) {
        return {
          km,
          name: "Minimo/Price",
        };
      } else if (km == 1) {
        return {
          km,
          name: "Adicional/Price",
        };
      } else {
        return {
          km,
          name: "Extra",
        };
      }
    });

    return keys.sort((a, b) => b.km - a.km);
  }, [data]);

  const [selectedRate, setSelectRate] = React.useState<ITypeRatePrice | null>(
    null
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tarifas por Tipo de Vehículo</CardTitle>
          <CardDescription>Lista de precios</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="text-center">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Tipo de Vehículo</TableHead>
                {kms.map(({ name }, i) => (
                  <TableHead key={i} className="text-center">
                    {name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.ratePrices.map((rate, i) => {
                const { type, prices } = rate;

                const priceMap: {
                  [key: number]: IPriceRate;
                } = prices
                  ? prices.reduce(
                      (
                        acc: {
                          [key: number]: IPriceRate;
                        },
                        price: IPriceRate
                      ) => {
                        acc[price.km] = price;
                        return acc;
                      },
                      {}
                    )
                  : {};

                return (
                  <TableRow key={i}>
                    <TableCell>{type.name}</TableCell>
                    {kms.map(({ km }, idx) => (
                      <TableCell key={idx}>
                        {priceMap[km] !== undefined ? (
                          <span className="flex flex-col">
                            <p>{priceMap[km].km} km</p>
                            <p>
                              {formatPrice(
                                priceMap[km].priceKm,
                                priceMap[km].coin.symbol
                              )}{" "}
                              {priceMap[km].coin.symbol}
                            </p>
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedRate && coins && (
        <Modal id="update-rate" bodyScroll={false} {...modalRest}>
          <EditRate
            rate={selectedRate}
            coins={coins}
            refresh={refresh}
            {...modalRest}
          />
        </Modal>
      )}
    </>
  );
};

export default RatesTable;
