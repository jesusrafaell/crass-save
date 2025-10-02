import { ReactNode } from "react";
import styled from "styled-components";

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

const Button = ({ children, ...props }: ButtonProps) => {
  return <ButtonStyled {...props}>{children}</ButtonStyled>;
};

const ButtonStyled = styled.button`
  padding: 10px 12px;
  border-radius: 14px;
  color: #fff;
  background-color: #000;
  font-size: 0.8em;
  user-select: none;
  transition: opacity 0.25s linear;
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: default;
  }
`;

export default Button;
