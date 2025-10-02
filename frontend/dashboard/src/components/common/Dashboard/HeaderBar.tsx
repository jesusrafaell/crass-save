"use client";

import React from "react";
import styled from "styled-components";
import ToggleLight from "@/components/common/ToggleLight";
import { GiMechanicGarage } from "react-icons/gi";
import logo from "@/images/logo.png";
import {
  GrOverview,
  GrMapLocation,
  GrList,
  GrLogout,
  GrNotes,
} from "react-icons/gr";
import { usePathname } from "next/navigation";
import CustomLink from "@/components/common/CustomLink";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { useLogout } from "@/hooks/auth";
import { useTranslations } from "next-intl";
import { IAuthLayout } from "@/app/[locale]/(auth)/layout";
import useWindowSize from "@/hooks/useWindowSize";
import Image from "next/image";

const HeaderBar = ({ loggedUser }: { loggedUser: IAuthLayout }) => {
  const pathname = usePathname();
  const t = useTranslations("NavBar");
  const { isMobile } = useWindowSize();

  const { mutateAsync: logoutUserFn } = useLogout();

  const handleLogout = async () => {
    await logoutUserFn();
  };

  const { user } = loggedUser;

  return (
    <HeaderBarStyled>
      <CustomLink href="/dashboard">
        <div className="logo">
          <div className="circle max-w-[100px]">
            <Image src={logo} alt="myappssistance" />
          </div>
          <h1 className="hidden lg:block">Myappssistance</h1>
        </div>
      </CustomLink>

      <nav>
        <ul>
          <CustomLink href="/dashboard">
            <li className={pathname.includes("/dashboard") ? "current" : ""}>
              <GrOverview />
            </li>
          </CustomLink>
          <CustomLink href="/driver/map">
            <li className={pathname.includes("/driver/map") ? "current" : ""}>
              <GrMapLocation />
            </li>
          </CustomLink>
          <CustomLink href="/driver/list">
            <li className={pathname.includes("/driver/list") ? "current" : ""}>
              <GrList />
            </li>
          </CustomLink>
          <CustomLink href="/request">
            <li className={pathname.includes("/request") ? "current" : ""}>
              <GrNotes />
            </li>
          </CustomLink>
        </ul>
      </nav>

      <div className="options">
        {!isMobile && <ToggleLight />}
        <Dropdown placement="bottom-start" style={{ color: "#000" }}>
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                src: user?.photo,
              }}
              className="transition-transform"
              classNames={{
                name: "hidden sm:flex",
                description: "hidden sm:flex line line-clamp-1",
              }}
              name={`${user?.firstName} ${user?.lastName}`}
              description={user?.email}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions">
            <DropdownItem key="profile" className="h-14 gap-2 cursor-default">
              <p className="font-bold">{t("signedas")}</p>
              <p className="font-bold text-xs">{user?.email}</p>
            </DropdownItem>

            <DropdownItem
              key="toggle"
              style={{ display: isMobile ? "block" : "none" }}
            >
              <div className="flex items-center justify-between">
                Modo:
                <ToggleLight />
              </div>
            </DropdownItem>

            <DropdownItem key="logout" as="button" onClick={handleLogout}>
              <p className="flex items-center gap-2">
                <GrLogout /> <span>{t("logout")}</span>
              </p>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </HeaderBarStyled>
  );
};

const HeaderBarStyled = styled.header`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 10px 30px;
  z-index: 100;
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    user-select: none;
    cursor: pointer;
    .circle {
      svg {
        font-size: 2em;
      }
    }
    h1 {
      font-weight: 600;
      letter-spacing: 0.1;
    }
  }
  nav {
    display: none;
    width: 100%;
    ul {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      li {
        cursor: pointer;
        color: ${({ theme }) => theme.colors.disabledColor};

        svg {
          font-size: 1.2em;
        }
        &.current {
          border-bottom: 4px solid ${({ theme }) => theme.colors.primary};
        }
      }
    }
  }
  .options {
    display: flex;
    align-items: center;
    gap: 10px;

    .toggle {
      width: 15px;
      height: 15px;
      cursor: pointer;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    box-shadow: 0px 2px 10px -5px ${({ theme }) => theme.boxShadowColor};
    nav {
      display: block;
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    nav ul {
    }
  }
`;

export default HeaderBar;
