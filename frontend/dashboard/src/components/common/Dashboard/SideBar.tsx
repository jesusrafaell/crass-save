"use client";

import React from "react";
import styled from "styled-components";
import CustomLink from "@/components/common/CustomLink";
import {
  GrOverview,
  GrMapLocation,
  GrList,
  GrLogout,
  GrCar,
  GrNotes,
} from "react-icons/gr";
import { useLogout } from "@/hooks/auth";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { FaCarSide } from "react-icons/fa";
import { Accordion, AccordionItem } from "@nextui-org/react";
import themes from "@/utils/themes";
import { GiTowTruck } from "react-icons/gi";
import { useTheme } from "@/context/theme";
const SideBar = () => {
  const { mutateAsync: logoutUserFn } = useLogout();
  const t = useTranslations("NavBar");
  const pathname = usePathname();
  const { theme } = useTheme();
  const handleLogout = async () => {
    await logoutUserFn();
  };

  return (
    <SideBarStyled>
      <nav>
        <ul>
          <CustomLink href={"/dashboard"}>
            <li className={pathname.includes("/dashboard") ? "current" : ""}>
              <GrOverview /> <span>Descripción general</span>
            </li>
          </CustomLink>
          <Accordion defaultExpandedKeys={["1"]} className="px-[15px]">
            <AccordionItem
              key="1"
              aria-label="Grueros"
              title="Grueros"
              classNames={{
                title: "title-accordion",
              }}
              startContent={
                <FaCarSide
                  fontSize="1.2em"
                  color={
                    theme === "light" ? themes.light.colors.primary : "#fff"
                  }
                />
              }
            >
              <CustomLink href={"/driver/map"}>
                <li
                  className={pathname.includes("/driver/map") ? "current" : ""}
                >
                  <GrMapLocation />
                  <span>Mapa</span>
                </li>
              </CustomLink>
              <CustomLink href={"/driver/list"}>
                <li
                  className={pathname.includes("/driver/list") ? "current" : ""}
                >
                  <GrList />
                  <span>Gestionar</span>
                </li>
              </CustomLink>
            </AccordionItem>
          </Accordion>

          <CustomLink href={"/tow-truck"}>
            <li className={pathname.includes("/tow-truck") ? "current" : ""}>
              <GiTowTruck />
              <span>Gruas</span>
            </li>
          </CustomLink>

          <CustomLink href={"/request"}>
            <li className={pathname.includes("/request") ? "current" : ""}>
              <GrNotes />
              <span>Solicitudes</span>
            </li>
          </CustomLink>

          <CustomLink href={"/rates"}>
            <li className={pathname.includes("/rates") ? "current" : ""}>
              <GrNotes />
              <span>Tarifas</span>
            </li>
          </CustomLink>
        </ul>
        <div className="logout-button" role="button" onClick={handleLogout}>
          <GrLogout />
          <span>{t("logout")}</span>
        </div>
      </nav>
    </SideBarStyled>
  );
};

const SideBarStyled = styled.aside`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 40px;
  height: 100%;
  padding: 0px 20px 20px;
  font-size: 18px;
  box-shadow: ${({ theme }) => `10px 10px 12px -8.5px ${theme.boxShadowColor}`};
  z-index: 101;
  transition: box-shadow 0.25s linear;

  nav {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    font-size: 0.8em;
    ul,
    li {
      list-style-type: none;
    }
    ul {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    li,
    .logout-button {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      border-radius: 3px 3px 20px 3px;
      color: ${({ theme }) => theme.disabledColor};
      cursor: pointer;
      transition: all 0.25s linear;
      &.current {
        color: #fff;
        background-color: ${({ theme }) => theme.colors.primary};
      }
      &:hover:not(.current) {
        color: ${({ theme }) => theme.color};
      }
      svg {
        font-size: 1.2em;
      }
    }
    .logout-button {
      margin-top: auto;
      color: ${({ theme }) => theme.color};
    }
  }

  .title-accordion {
    font-size: 1em;
    color: ${({ theme }) => theme.disabledColor};
  }
`;

export default SideBar;
