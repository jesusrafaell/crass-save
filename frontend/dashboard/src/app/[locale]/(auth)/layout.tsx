"use client";

import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { getCompany, getUser } from "@/app/actions";
import SideBar from "@/components/common/Dashboard/SideBar";
import HeaderBar from "@/components/common/Dashboard/HeaderBar";
import { ICompany, IUser } from "@/models";
import { LoadScript } from "@react-google-maps/api";

const apikey: string = process.env.NEXT_PUBLIC_URL_MAP!;

const HEADER_HEIGHT = 80;

export interface IAuthLayout {
  user: IUser | null;
  company: ICompany | null;
}

const AuthLayoutContext = createContext<IAuthLayout | null>(null);

export const useAuthLayoutContext = (): IAuthLayout | null =>
  useContext(AuthLayoutContext);

export default function ContentLayout({ children }: { children: ReactNode }) {
  const [loggedUser, setLoggedUser] = useState<IAuthLayout>({
    user: null,
    company: null,
  });

  useEffect(() => {
    (async () => {
      const [userFetched, companyFetched] = await Promise.all([
        getUser(),
        getCompany(),
      ]);
      setLoggedUser({ user: userFetched, company: companyFetched });
    })();
  }, []);

  if (!loggedUser.user || !loggedUser.company) return;

  return (
    <AuthLayoutContext.Provider value={loggedUser}>
      <LoadScript googleMapsApiKey={apikey}>
        <AuthLayoutStyled>
          <div className="sidebar">
            <SideBar />
          </div>
          <div className="headerbar">
            <HeaderBar loggedUser={loggedUser} />
          </div>
          <div className="content">{children}</div>
        </AuthLayoutStyled>
      </LoadScript>
    </AuthLayoutContext.Provider>
  );
}

const AuthLayoutStyled = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 300px) auto;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "header header"
    "sidebar content";
  height: 100vh;
  overflow: hidden;
  font-size: 18px;
  transition: font-size 0.25s linear;
  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    grid-template-areas:
      "header header"
      "content content";
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    font-size: 16px;
  }
  @media (max-width: 500px) {
    display: block;
  }

  .headerbar {
    grid-area: header;
    grid-column: 1 / 3;
    grid-row: 1 / 2;
    height: ${HEADER_HEIGHT}px;
  }

  .sidebar {
    grid-area: sidebar;
    grid-column: 1 / 2;
    height: calc(100vh - ${HEADER_HEIGHT}px);
    @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
      display: none;
    }
  }

  .content {
    grid-area: content;
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    height: calc(100vh - ${HEADER_HEIGHT}px);
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
      grid-column: 1 / 3;
    }
  }
`;
