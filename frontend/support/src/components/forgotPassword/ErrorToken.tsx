import { FC } from "react";

interface Props {
  message: string;
}

const ErrorToken: FC<Props> = ({ message }) => {
  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row justify-center items-center gap-x-5">
      <div className="text-center lg:text-start">
        <h1 className="text-5xl font-bold text-red-700">Error</h1>
        <h2 className="text-2xl mt-2">{message}</h2>
      </div>
      <img src="/public/logo.png" alt="myappssitacne" width={250} />
    </div>
  );
};

export default ErrorToken;
