import { useState, useEffect } from "react";

interface FetchResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useFetchData<T = unknown>(
  url: string,
  condition: boolean = true
): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!condition) return;
      try {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_URL_API}/${url}`);

        if (!res.ok) {
          throw new Error(
            `Error en la respuesta del servido. Status: ${res.status}`
          );
        }

        const { data: result } = await res.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Error al realizar la solicitud")
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (condition) fetchData();
  }, [url, condition]);

  return { data, error, isLoading };
}
