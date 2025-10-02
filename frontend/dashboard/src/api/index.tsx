"use client";
import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import { deleteCookie, getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_URL_API;
export const configAxios: AxiosRequestConfig = {
  baseURL: baseURL,
};

const api = Axios.create(configAxios);

api.interceptors.request.use(async (config: any) => {
  const token = getCookie("authToken");
  const locale = getCookie("NEXT_LOCALE");
  config.headers["Authorization"] = `Bearer ${token}`;
  config.headers["lang"] = `${locale}`;

  // if (!(config.data instanceof FormData)) {
  //   config.headers["Content-Type"] = "application/json";
  // }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status || 500;
    if (status === 401) {
      //   sesion expired
      deleteCookie("authToken");
      deleteCookie("role");
      window.location.replace(
        `/login?session=${encodeURIComponent("expired")}`
      );
    }
    return Promise.reject(error);
  }
);

export default api;
