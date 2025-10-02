import React, { useRef } from "react";
import {
  Transition,
  SwitchTransition,
  TransitionStatus,
} from "react-transition-group";
import styled from "styled-components";
import Spinner from "../Spinner";

type LoadingWrapperProps = {
  isLoading: boolean;
  error?: Error | boolean | string | null;
  children: React.ReactNode;
  refetch?: () => void;
  style?: React.CSSProperties;
  className?: string;
};

const timeout = 250;
const transitionStyle: Record<string, React.CSSProperties> = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading,
  error,
  children,
  style,
  refetch,
  ...props
}) => {
  const nodeRef = useRef();
  return (
    <SwitchTransition mode="out-in">
      <Transition
        key={`${isLoading || error}`}
        timeout={timeout}
        nodeRef={nodeRef}
      >
        {(state: TransitionStatus) => (
          <LoadingWrapperStyled
            style={{
              transition: `all ${timeout}ms linear`,
              ...transitionStyle[state],
              ...style,
            }}
            {...props}
          >
            {isLoading ? (
              <Spinner
                showText={false}
                style={{
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                }}
              />
            ) : error ? (
              <div className="error-wrapper">
                <div className="error-container">
                  <p className="error-message">
                    Ups! Ocurrió un error al cargar la información. .
                  </p>
                  {refetch && (
                    <div
                      className="refresh-button"
                      role="button"
                      onClick={refetch}
                    >
                      Recargar
                    </div>
                  )}
                </div>
              </div>
            ) : (
              children
            )}
          </LoadingWrapperStyled>
        )}
      </Transition>
    </SwitchTransition>
  );
};

const LoadingWrapperStyled = styled.div`
  .error-wrapper {
    display: grid;
    place-items: center;
    height: 100%;
    font-size: 0.8em;
    text-align: center;
    .refresh-button {
      display: inline-block;
      margin-top: 10px;
      padding: 5px 10px;
      border-radius: 12px;
      font-size: 1em;
      font-weight: 500;
      background-color: #fff;
      color: #000;
    }
  }
`;

export default LoadingWrapper;
