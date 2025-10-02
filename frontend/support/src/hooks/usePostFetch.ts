import { useState, useEffect, useCallback } from "react";

interface PostData {
  [key: string]: any;
}

interface ResponseData {
  [key: string]: any;
}

const usePostFetch = <T>(
  url: string,
  data: PostData
): {
  response: T | null;
  error: Error | null;
  isLoading: boolean;
  refetch: () => void;
} => {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!url || !data) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_URL_API}/${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(
          `Error en la respuesta del servido. Status: ${res.status}`
        );
      }

      const result: ResponseData = await res.json();
      setResponse(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error al realizar la solicitud")
      );
    } finally {
      setIsLoading(false);
    }
  }, [url, data]);

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = useCallback(() => {
    fetchData();
  }, []);

  return { response, error, isLoading, refetch };
};

export default usePostFetch;
