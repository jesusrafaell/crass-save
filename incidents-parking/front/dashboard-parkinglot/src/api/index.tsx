"use client";
import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import { deleteCookie, getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_URL_API;
export const configAxios: AxiosRequestConfig = {
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
};

const api = Axios.create(configAxios);

api.interceptors.request.use(async (config: any) => {
  const token = getCookie("token");
  const locale = getCookie("NEXT_LOCALE");
  config.headers["Authorization"] = `Bearer ${token}`;
  config.headers["lang"] = `${locale}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status || 500;
    // if (status === 401) {
    // 	//sesion expired
    // 	deleteCookie('token');
    // 	deleteCookie('role');
    // 	window.location.replace(`/login?session=${encodeURIComponent('expired')}`);
    // }
    return Promise.reject(error);
  }
);

// R030E;

export default api;
