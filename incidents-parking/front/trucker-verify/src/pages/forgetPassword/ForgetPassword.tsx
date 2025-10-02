import { useLayoutEffect, useRef, useState } from "react";
import { msgErrorToken } from "../../errors";
import Spinner from "../../components/Spinner";
import PasswordForm from "../../components/forgotPassword/PasswordForm";
import SucessMessage from "../../components/forgotPassword/SucessMessage";
import ErrorToken from "../../components/forgotPassword/ErrorToken";

function ChangePassword() {
  const hasRun = useRef(false);
  const [isChangedPassword, setIsChangedPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [message, setMessage] = useState("Tu acceso expiro  o no es valido");

  const [errorToken, setErrorToken] = useState(false);

  //valid token
  useLayoutEffect(() => {
    if (!hasRun.current) {
      const verifyToken = async () => {
        try {
          setIsLoading(true);

          const currentUrl = window.location.href;
          const urlParts = currentUrl.split("/");
          const token = urlParts[urlParts.length - 1];

          if (token) {
            const response = await fetch(
              `${
                import.meta.env.VITE_URL_API
              }/v1/api/verify-token/change-password`,
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
              setMessage("");
              setErrorToken(false);
            } else {
              const errorResponse: { error: string; name?: string } =
                await response.json();
              // console.log(errorResponse);
              throw new Error(errorResponse.error);
            }
          }
        } catch (error) {
          const _error = error as Error;
          if (_error.message === "R030E") {
            setMessage(msgErrorToken.R030E);
          } else {
            setMessage(msgErrorToken.R017E);
          }
          setErrorToken(true);
        } finally {
          setIsLoading(false);
        }
      };

      verifyToken();
      hasRun.current = true; // Marcar que el useEffect ha corrido
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependencias vacías para que se ejecute solo una vez

  const onSubmit = async (password: string) => {
    try {
      setLoad(true);

      const currentUrl = window.location.href;
      const urlParts = currentUrl.split("/");
      const token = urlParts[urlParts.length - 1];
      if (token) {
        const response = await fetch(
          `${import.meta.env.VITE_URL_API}/v1/api/auth/forgot-password`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: password, token }),
          }
        );

        if (response.ok) {
          setIsChangedPassword(true);
        } else {
          // const errorResponse = await response.json();
          throw new Error("Error");
        }
      }
    } catch (error) {
      console.error(`Error al cambiar contraseña: ${error as Error}`);
      throw error;
    } finally {
      setLoad(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <Spinner />
      </div>
    );
  }

  if (!errorToken) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
          <div className="mx-auto container ">
            <div className="w-full flex justify-center items-center mb-10 -mt-20">
              <img src="/crashsaver-logo.png" alt="logo" width={120} />
            </div>
            <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200 min-w-[350px]">
              {!isChangedPassword ? (
                <PasswordForm onSubmit={onSubmit} load={load} />
              ) : (
                <SucessMessage />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <ErrorToken message={message} />;
  }
}

export default ChangePassword;
