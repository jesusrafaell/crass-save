import { ReactElement } from "react";
import {
  FaCarCrash,
  FaCheckCircle,
  FaChartPie,
  FaClock,
  FaUser,
  FaUserPlus,
  FaUserMinus,
  FaRegClipboard,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

type Card = {
  [key: string]: string;
};

export type CardProps = {
  [key: string]: { name: string; Icon: IconType };
};
export type CardsProps = {
  cards: Card;
  cardProps: CardProps;
  link: string;
  children?: ReactElement;
};

export const servicesCard: CardProps = {
  active: {
    name: "Servicios activos",
    Icon: FaCarCrash,
  },
  completed: {
    name: "Servicios completados",
    Icon: FaCheckCircle,
  },
  cancelled: {
    name: "Servicios cancelados",
    Icon: FaChartPie,
  },
  pending: {
    name: "Servicios pendientes",
    Icon: FaClock,
  },

  total: {
    name: "Servicios",
    Icon: FaRegClipboard,
  },
};
export const driversCard: CardProps = {
  total: {
    name: "Grueros",
    Icon: FaUser,
  },
  active: {
    name: "Grueros activos",
    Icon: FaUserPlus,
  },
  inactive: {
    name: "Grueros inactivos",
    Icon: FaUserMinus,
  },
};
