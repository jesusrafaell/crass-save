"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import styled from "styled-components";
import { Tabs as UITabs, Tab } from "@nextui-org/react";
import { useAuthLayoutContext, IAuthLayout } from "../layout";
import { servicesCard, driversCard, CardsProps } from "./Cards/data";
import LoadingWrapper from "@/components/common/LoadingWrapper";
import { useFetchData } from "@/hooks/useFetchData";
import Map from "@/components/common/Map";
import themes from "@/utils/themes";
import Cards from "./Cards";
import { SwitchTransition } from "react-transition-group";
import { Transition } from "@/lib/Transition";

type OptionsSelect = "services" | "towtrucks" | "drivers" | "realtime";

const Dashboard = () => {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const loggedUser: IAuthLayout | null = useAuthLayoutContext();

  const [selected, setSelected] = useState<OptionsSelect>("services");

  const {
    data: requests,
    error,
    isLoading,
    refreshData,
  } = useFetchData(
    `/api/v1/assistance/requests/company/dashboard-data/${loggedUser?.company?.id}`
  );

  const services = requests?.data.services;
  const drivers = requests?.data.drivers;

  // const props: CardsProps = useMemo(() => {
  //   return {
  //     cards: selected === "services" ? services : drivers,
  //     cardProps: selected === "services" ? servicesCard : driversCard,
  //     link: selected === "services" ? "/request" : "/driver/list",
  //     ...(selected === "drivers"
  //       ? {
  //           children: (
  //             <div className="map">
  //               <Map />
  //             </div>
  //           ),
  //         }
  //       : {}),
  //   };
  // }, [selected, drivers, services]);

  const onTransition = (done: () => void, status?: string) => {
    const isExiting = status === "exiting";
    gsap.to(nodeRef.current, {
      duration: 0.3,
      opacity: isExiting ? 0 : 1,
      x: isExiting ? 20 : 0,
      onComplete: done,
    });
  };

  const getComponent = (selected: OptionsSelect) => {
    switch (selected) {
      case "services":
        return (
          <Cards cards={services} cardProps={servicesCard} link="/request" />
        );

      case "drivers":
        return (
          <Cards cards={drivers} cardProps={driversCard} link="/driver/list" />
        );

      case "realtime":
        return (
          <div className="map">
            <Map />
          </div>
        );
    }
  };

  return (
    <DashboardStyled>
      <div className="greeting">
        {/* <h2>Welcome back, {loggedUser?.user?.firstName}</h2>
        <p>Here&apos;s what&apos;s happening with your app</p> */}
        <h2>Bienvenido de nuevo, {loggedUser?.user?.firstName}</h2>
        <p>Esto es lo que está pasando con tu aplicación</p>
      </div>

      <Tabs
        aria-label="Options"
        variant="light"
        disabledKeys={["towtrucks"]}
        defaultSelectedKey="services"
        className="mt-10 mb-5"
        classNames={{
          tabList: "gap-3 w-full",
          cursor: `bg-[${themes.light.colors.primary}]`,
          tabContent: `group-data-[selected=true]:text-[#fff]`,
        }}
        selectedKey={selected}
        onSelectionChange={(e) => setSelected(e as OptionsSelect)}
      >
        <Tab
          key="services"
          title={
            <div className="flex items-center space-x-2">
              <span>Servicios</span>
            </div>
          }
        />
        <Tab
          key="towtrucks"
          title={
            <div className="flex items-center space-x-2">
              <span>Grúas</span>
            </div>
          }
        />
        <Tab
          key="drivers"
          title={
            <div className="flex items-center space-x-2">
              <span>Grueros</span>
            </div>
          }
        />
        <Tab
          key="realtime"
          title={
            <div className="flex items-center space-x-2">
              <span>Tiempo real</span>
            </div>
          }
        />
      </Tabs>

      <LoadingWrapper
        isLoading={isLoading || !services || !drivers}
        error={error}
        style={{ flexGrow: 1 }}
      >
        <SwitchTransition mode="out-in">
          <Transition
            nodeRef={nodeRef}
            key={selected}
            mountOnEnter
            unmountOnExit
            appear
            addEndListener={onTransition}
          >
            <div
              className="cards-wrapper"
              ref={nodeRef}
              style={{ height: selected === "realtime" ? "95%" : "auto" }}
            >
              {getComponent(selected)}
            </div>
          </Transition>
        </SwitchTransition>
      </LoadingWrapper>
    </DashboardStyled>
  );
};

const Tabs = styled(UITabs)`
  button span {
    font-size: 0.9em;
  }
  .text-default-500 {
    color: ${({ theme }) => theme.disabledColor};
  }
`;

const DashboardStyled = styled.section`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;

  .greeting {
    h2 {
      font-size: 1.5em;
      font-weight: 800;
    }
    p {
      font-size: 0.7em;
      color: ${({ theme }) => theme.disabledColor};
    }
  }

  .cards-wrapper {
    transform: translateX(-10px);
    opacity: 0;
    .map {
      height: 100%;
      margin-top: 20px;
      border-radius: 20px;
      overflow: hidden;
    }
  }
`;

export default Dashboard;
