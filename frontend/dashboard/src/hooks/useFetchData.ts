import useSWR from "swr";
import api from "@/api";

const fetcher = async (url: string): Promise<any> => {
  const res = await api.get(url);
  return res.data;
};

export const useFetchData = <T = any>(url: string) => {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher);

  return {
    data,
    error,
    isLoading,
    refreshData: mutate,
  };
};
