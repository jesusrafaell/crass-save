import { useState, useRef, useLayoutEffect } from "react";
import { msgErrorToken } from "../../errors";
import SpinnerVerify, {
  StatusTypeSpinner,
} from "../../components/SpinnerVerify";

function VerifyTrucker() {
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);
  const [status, setStatus] = useState<StatusTypeSpinner>("loading");

  useLayoutEffect(() => {
    if (!hasRun.current) {
      const verifyEmail = async () => {
        try {
          setStatus("loading");

          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          const token = urlParams.get("token");

          if (token) {
            const response = await fetch(
              `${
                import.meta.env.VITE_URL_API
              }/v1/api/users/verify-token/verify-truck`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
              }
            );

            if (response.ok) {
              // setIsEmailVerified(true);
              //recibir corrreo
              const data: { message: string; ok: boolean } =
                await response.json();
              console.log(data);
              setStatus("success");
              setMessage("Listo");
            } else {
              // setIsEmailVerified(false);
              const errorResponse: { error: string; name?: string } =
                await response.json();
              throw new Error(errorResponse.error);
            }
          }
        } catch (error) {
          // console.log(error);
          setMessage(msgErrorToken.R017E);
          setStatus("error");
        }
      };

      verifyEmail();
      hasRun.current = true; // Marcar que el useEffect ha corrido
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependencias vacías para que se ejecute solo una vez

  const messageText = {
    loading: "Verificando...",
    success: "Verificado",
    error: "Error",
  };

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="mx-5 h-[300px] w-[350px] lg:w-[400px] overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-xl py-10 px-20">
        <SpinnerVerify status={status} />
        <h1 className="mt-2 text-center text-2xl font-bold text-gray-500">
          {messageText[status]}
        </h1>
        <p className="my-4 text-center text-md text-gray-500">{message}</p>
      </div>
      <div className="w-[150px] mt-5">
        <img src="/crashsaver-logo.png" alt="logo" />
      </div>
    </div>
  );
}

export default VerifyTrucker;
