import React, { forwardRef } from "react";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";

type StylesProps = string;

interface BoxProps {
  defaultCloseButton?: boolean;
  title?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  close?: () => void;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ style, children, close }, ref) => {
    return (
      <BoxStyled ref={ref} style={style}>
        <div className="header">
          <IoMdClose
            className="close-button"
            role="button"
            fontSize="1.5em"
            onClick={close}
          />
        </div>
        <div className="body">{children}</div>
      </BoxStyled>
    );
  }
);

Box.displayName = "Box";

const BoxStyled = styled.div<{ genStyles?: string }>`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 95%;
  padding: 15px;
  border-radius: 15px 15px 0 0;
  transform: translate(0, 100%);
  background-color: ${({ theme }) => theme.backgroundColor};
  box-shadow: 0 0 40px -8px ${({ theme }) => theme.boxShadowColor};
  overflow: hidden;
  @media (min-width: 800px) {
    bottom: 50%;
    left: 50%;
    max-height: 92%;
    width: 80%;
    max-width: 780px;
    border-radius: 15px;
    transition: border-radius 0.25s linear;
    transform: translate(-50%, 100%);
  }
  .header {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .body {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

export default Box;
