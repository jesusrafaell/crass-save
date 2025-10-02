/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import api from "@/api";
import {
  bookingUrl,
  companyUrl,
  parkingParkingUrl,
  productsUrl,
  servByParkingUrl,
  servicesUrl,
  statusUrl,
} from "@/api/endpoints";
import getErrorDescription, { mantainanceError } from "@/api/errorsList";
import { IGetProducts, Product, Service } from "@/interfaces/booking";
import {
  IActionResp,
  ICompany,
  IGlobalContext,
  IParking,
  IStatus,
} from "@/interfaces/globalContext";
import { AxiosError, AxiosResponse } from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import {
  ReactNode,
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

interface Props {
  children: ReactNode;
}

const GlobalContext = createContext<IGlobalContext>({
  services: [],
  parkings: [],
  products: [],
  status: [],
  companyList: [],
  loading: false,
  showBalance: false,
  toggleShowBalance: () => {},
  putBookingStatus: () => new Promise(() => undefined),
  cancelBooking: () => new Promise(() => undefined),
  getServicesListByParking: () => new Promise(() => undefined),
});

export const GlobalContextProvider = ({ children }: Props) => {
  const balanceCookie = getCookie("showBalance");
  const [loading, setloading] = useState(false);
  const [showBalance, setshowBalance] = useState<boolean>(false);
  const [services, setservices] = useState<Service[]>([]);
  const [products, setproducts] = useState<Product[]>([]);
  const [parkings, setparkings] = useState<IParking[]>([]);
  const [status, setstatus] = useState<IStatus[]>([]);
  const [companyList, setcompanyList] = useState<ICompany[]>([]);

  const toggleShowBalance = () =>
    setshowBalance((prev) => {
      const value = !prev;
      if (value) {
        setCookie("showBalance", value);
      } else {
        deleteCookie("showBalance");
      }
      return value;
    });

  const getServicesList = async () => {
    try {
      await api
        .get(servicesUrl)
        .then((res: AxiosResponse<{ data: Service[]; ok: boolean }>) =>
          setservices(res.data.data)
        );
    } catch (error) {
      console.log("Error getServicesList", error);
    }
  };

  const getProductsList = async () => {
    try {
      await api
        .get(productsUrl)
        .then((res: AxiosResponse<IGetProducts>) => setproducts(res.data.data));
    } catch (error) {
      console.log("Error getProductsList", error);
    }
  };

  const getServicesListByParking = async (parkingId: string) => {
    try {
      return await api
        .get(servByParkingUrl + `/${parkingId}`)
        .then(
          (res: AxiosResponse<{ data: Service[]; ok: boolean }>) =>
            res.data.data
        );
    } catch (error) {
      const _error = error as AxiosError<{ error: string }>;
      console.log("Error getServicesListByParking", _error);
      if (_error.response && _error.response.data.error) {
        const message = getErrorDescription(_error.response.data.error);
        throw new Error(message, { cause: _error.response.data.error });
      }
      throw new Error(mantainanceError);
    }
  };

  const getParkingList = async () => {
    try {
      await api.get(parkingParkingUrl + "/all").then(
        (
          res: AxiosResponse<{
            data: IParking[];
            ok: boolean;
          }>
        ) => setparkings(res.data.data)
      );
    } catch (error) {
      console.log("Error getParkingList", error);
    }
  };

  const getStatusList = async () => {
    try {
      await api.get(statusUrl).then(
        (
          res: AxiosResponse<{
            data: IStatus[];
            ok: boolean;
          }>
        ) => setstatus(res.data.data)
      );
    } catch (error) {
      console.log("Error getParkingList", error);
    }
  };

  const getCompanyList = async () => {
    try {
      await api.get(companyUrl + "/all").then(
        (
          res: AxiosResponse<{
            data: ICompany[];
            ok: boolean;
          }>
        ) => setcompanyList(res.data.data)
      );
    } catch (error) {
      console.log("Error getParkingList", error);
    }
  };

  const putBookingStatus = async (bookingId: string, statusId: string) => {
    try {
      return await api
        .put(bookingUrl + `/${bookingId}`, {
          statusId,
        })
        .then((res: AxiosResponse<IActionResp>) => res.data);
    } catch (error) {
      console.log("Error putBookingStatus", error);
      const _error = error as AxiosError<{ error: string }>;
      if (_error.response && _error.response.data.error) {
        const message = getErrorDescription(_error.response.data.error);
        throw new Error(message, { cause: _error.response.data.error });
      }
      throw new Error(mantainanceError);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      return await api
        .post(bookingUrl + "/cancel", {
          bookingId,
        })
        .then((res: AxiosResponse<IActionResp>) => res.data);
    } catch (error) {
      console.log("Error cancelBooking", error);
      const _error = error as AxiosError<{ error: string }>;
      if (_error.response && _error.response.data.error) {
        // const message = getErrorDescription(_error.response.data.error);
        throw new Error(_error.response.data.error, {
          cause: _error.response.data.error,
        });
      }
      throw new Error(mantainanceError);
    }
  };

  const getData = async () => {
    setloading(true);
    await getServicesList();
    await getParkingList();
    await getStatusList();
    await getProductsList();
    await getCompanyList().finally(() => setloading(false));
  };

  useEffect(() => {
    if (balanceCookie) {
      setshowBalance(true);
      return;
    }
    setshowBalance(false);
  }, [balanceCookie]);

  useLayoutEffect(() => {
    getData();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        status,
        loading,
        services,
        products,
        parkings,
        companyList,
        showBalance,
        toggleShowBalance,
        putBookingStatus,
        cancelBooking,
        getServicesListByParking,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
