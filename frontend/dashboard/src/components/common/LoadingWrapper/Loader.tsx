import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <LoaderStyled>
      <span className="loader" />
    </LoaderStyled>
  );
};

const LoaderStyled = styled.div`
  height: 100%;
  display: grid;
  place-items: center;
  .loader {
    width: 48px;
    height: 48px;
    border: 3px solid ${({ theme }) => theme.color};
    border-radius: 50%;
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;

    &::after {
      content: "";
      box-sizing: border-box;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 3px solid transparent;
      border-bottom-color: ${({ theme }) => theme.colors.primary};
    }
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loader;
