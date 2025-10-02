import React from "react";
import { Card } from "@nextui-org/react";
import { WelcomeBannerProps } from "./WelcomeBanner";

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  name = "",
  message = "",
}) => {
  return (
    <div
      id="welcome-banner"
      className="w-full h-full gap-4 my-2 md:my-4 place-items-center"
    >
      <Card className="w-full rounded-md px-6 gap-2 flex flex-row justify-center items-center py-2 overflow-hidden">
        <h4 className="flex gap-2">
          {message.split(" ").map((word, index) => (
            <span key={index} className="inline-block">
              {word}{" "}
            </span>
          ))}
        </h4>
        <h3>
          <strong>
            <span className="inline-block">{name}</span>
          </strong>
        </h3>
      </Card>
    </div>
  );
};

export default WelcomeBanner;
