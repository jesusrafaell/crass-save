import React, { useRef, useState } from "react";
import gsap from "gsap";
import styled from "styled-components";
import themes from "@/utils/themes";
import {
  Card as UICard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs as UITabs, Tab } from "@nextui-org/react";
import { useTheme } from "@/context/theme";
import Add from "./Add";
import LoadingWrapper from "@/components/common/LoadingWrapper";
import { SwitchTransition } from "react-transition-group";
import { Transition } from "@/lib/Transition";
import History from "./History";
import { useFetchData } from "@/hooks/useFetchData";
import { getExpenseHistory } from "@/api/endpoints";

type TabSelectProp = "add" | "history";

type SpendingModalContentProps = {
  towTruckId: string;
  close: () => void;
};

const SpendingModal = (props: SpendingModalContentProps) => {
  const { theme } = useTheme();
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [tabSelected, setTabSelected] = useState<TabSelectProp>("add");

  const {
    data: history,
    refreshData: refreshHistory,
    ...fetchedHistoryProps
  } = useFetchData(getExpenseHistory(props.towTruckId));

  const goToHistory = () => setTabSelected("history");

  const onTransition = (done: () => void, status?: string) => {
    const isExiting = status === "exiting";

    gsap.to(nodeRef.current, {
      duration: 0.3,
      opacity: isExiting ? 0 : 1,
      x: isExiting ? 20 : 0,
      ease: "back.inOut(2)",
      onComplete: done,
    });
  };

  return (
    <SpendingModalStyled>
      <Card className="flex flex-col w-full h-full max-w-lg">
        <CardHeader>
          <CardTitle>Registros de gastos</CardTitle>
          <CardDescription>
            Acá podrás ver y agregar registros a tu historial de gastos.
          </CardDescription>
          <Tabs
            aria-label="Options"
            variant="underlined"
            defaultSelectedKey="add"
            className="mt-15 mb-5"
            classNames={{
              tabList: "gap-2",
              tab: "pb-0",
              cursor: `bg-[${themes.light.colors.primary}]`,
              // tabContent: `group-data-[selected=true]:text-[${themes[theme].color}]`,
              tabContent: `group-data-[selected=true]:text-[${
                theme === "light" ? themes.light.color : themes.dark.color
              }]`,
            }}
            selectedKey={tabSelected}
            onSelectionChange={(e) => setTabSelected(e as TabSelectProp)}
          >
            <Tab
              key="add"
              title={
                <div className="flex items-center space-x-2">
                  <span>Agregar</span>
                </div>
              }
            />
            <Tab
              key="history"
              title={
                <div className="flex items-center space-x-2">
                  <span>Historial</span>
                </div>
              }
            />
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-4 grow">
          <SwitchTransition mode="out-in">
            <Transition
              nodeRef={nodeRef}
              key={tabSelected}
              mountOnEnter
              unmountOnExit
              appear
              addEndListener={onTransition}
            >
              <div className="tabs-content" ref={nodeRef}>
                {tabSelected === "add" ? (
                  <Add
                    {...props}
                    goToHistory={goToHistory}
                    refreshHistory={refreshHistory}
                  />
                ) : (
                  <History history={history?.data} {...fetchedHistoryProps} />
                )}
              </div>
            </Transition>
          </SwitchTransition>
        </CardContent>
      </Card>
    </SpendingModalStyled>
  );
};

const Tabs = styled(UITabs)`
  margin: 20px 0 20px -10px !important;
  button {
    span {
      font-size: 0.9em;
      font-weight: 600;
    }
  }
  .text-default-500 {
    color: ${({ theme }) => theme.disabledColor};
  }
`;

const SpendingModalStyled = styled.div`
  height: 100%;
  padding: 10px;
  .tabs-content {
    height: 100%;
    flex-grow: 1;
    transform: translateX(-10px);
    opacity: 0;
  }
`;

const Card = styled(UICard)`
  max-width: none;
  border: none;
  box-shadow: unset;

  input {
    color: #000;
  }
`;

export default SpendingModal;
