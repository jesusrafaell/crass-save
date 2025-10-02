import React, { useRef, useState } from "react";
import gsap from "gsap";
import styled from "styled-components";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Calendar from "@/components/common/Calendar";
import { PrefixInput } from "@/components/ui/prefixInput";
import { SwitchTransition } from "react-transition-group";
import { Transition } from "@/lib/Transition";
import { useFetchData } from "@/hooks/useFetchData";
import LoadingWrapper from "@/components/common/LoadingWrapper";
import Amount from "./Amount";
import ExpenseTypeSelector from "./ExpenseTypeSelector";
import ActionButtons from "./ActionButtons";
import { expenseTypes } from "./ExpenseTypeSelector";
import { getCoins } from "@/api/endpoints";

export type SpendingStateProps = {
  expenseType: number;
  date: Date;
  currencyType: string;
  amount: number;
  fuelLiters?: number;
  description?: string;
};

type AddRecordProps = {
  towTruckId: string;
  close: () => void;
  goToHistory: () => void;
  refreshHistory: () => void;
};

const AddRecord = (props: AddRecordProps) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const {
    data: coins,
    error: coinsError,
    isLoading: coinsIsLoading,
  } = useFetchData(getCoins);

  const [data, setData] = useState<SpendingStateProps>({
    expenseType: expenseTypes[0].id,
    date: new Date(),
    currencyType: coins?.data[0].id,
    amount: 0,
    fuelLiters: 1,
    description: "",
  });

  const onTransition = (done: () => void, status?: string) => {
    const isExiting = status === "exiting";

    gsap.to(nodeRef.current, {
      duration: 0.25,
      opacity: isExiting ? 0 : 1,
      scale: isExiting ? 0.9 : 1,
      ease: "back.inOut(2)",
      onComplete: done,
    });
  };

  return (
    <AddRecordStyled>
      <LoadingWrapper
        isLoading={coinsIsLoading}
        error={coinsError}
        style={{ flexGrow: 1, height: "100%" }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <ExpenseTypeSelector data={data} setData={setData} />
          </div>
          <div className="space-y-2">
            <Calendar
              date={data.date}
              setter={(date) => setData({ ...data, date })}
            />
          </div>
        </div>
        <Amount coins={coins?.data} data={data} setData={setData} />

        <SwitchTransition mode="out-in">
          <Transition
            nodeRef={nodeRef}
            key={
              expenseTypes[data.expenseType].name === "Gasolina"
                ? "liters"
                : "description"
            }
            mountOnEnter
            unmountOnExit
            appear
            addEndListener={onTransition}
          >
            <div ref={nodeRef} className="space-y-2 conditioned-input">
              {expenseTypes[data.expenseType].name === "Gasolina" ? (
                <>
                  <Label htmlFor="fuelLiters">Litros de gasolina</Label>
                  <PrefixInput
                    id="fuelLiters"
                    type="number"
                    placeholder="Cantidad de gasolina"
                    min={1}
                    value={data.fuelLiters}
                    prefix="L"
                    onChange={(e) =>
                      setData({
                        ...data,
                        fuelLiters: parseInt(e.target.value),
                      })
                    }
                  />
                </>
              ) : (
                <>
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="Ingresa breve descripción"
                    min={1}
                    value={data.description}
                    onChange={(e) =>
                      setData({
                        ...data,
                        description: e.target.value,
                      })
                    }
                  />
                </>
              )}
            </div>
          </Transition>
        </SwitchTransition>

        <ActionButtons data={data} {...props} />
      </LoadingWrapper>
    </AddRecordStyled>
  );
};

const AddRecordStyled = styled.div`
  height: 100%;
  .conditioned-input {
    opacity: 0;
    transform: scale(0.9);
  }
`;

export default AddRecord;
