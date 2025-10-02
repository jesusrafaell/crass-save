import { useState, useEffect } from "react";

type Request = {
  key: string;
  url: string;
};

interface FetchMultipleResult {
  data: { [key: string]: any };
  error: { [key: string]: Error | null };
  isLoading: { [key: string]: boolean };
  isAnyLoading: boolean;
  isAnyError: boolean;
}

export function useFetchMultipleData(requests: Request[]): FetchMultipleResult {
  const [data, setData] = useState<{ [key: string]: any }>({});
  const [error, setError] = useState<{ [key: string]: Error | null }>({});
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    let isCancelled = false;

    requests.forEach(({ key }) => {
      setIsLoading((prev) => ({ ...prev, [key]: true }));
    });

    const fetchData = async () => {
      await Promise.all(
        requests.map(async ({ key, url }) => {
          try {
            const res = await fetch(`${import.meta.env.VITE_URL_API}/${url}`);
            if (!res.ok) {
              throw new Error(
                `Error en la respuesta del servido. Status: ${res.status}`
              );
            }
            const json = await res.json();
            if (!isCancelled) {
              setData((prevData) => ({ ...prevData, [key]: json.data }));
              setError((prevError) => ({ ...prevError, [key]: null }));
            }
          } catch (err) {
            if (!isCancelled) {
              setError((prevError) => ({
                ...prevError,
                [key]:
                  err instanceof Error ? err : new Error("An error occurred"),
              }));
            }
          } finally {
            if (!isCancelled) {
              setIsLoading((prevLoading) => ({ ...prevLoading, [key]: false }));
            }
          }
        })
      );
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const isAnyLoading = Object.values(isLoading).some((loading) => loading);
  const isAnyError = Object.values(error).some((err) => err !== null);

  return { data, error, isLoading, isAnyLoading, isAnyError };
}
