import React from "react";
import { IconType } from "react-icons/lib";
import styled from "styled-components";

type ButtonProps = {
  text: string;
  Icon?: IconType;
  onClick?: () => void;
};

const Button = ({ text, Icon, ...props }: ButtonProps) => {
  return (
    <ButtonStyled {...props}>
      {Icon && <Icon fontSize="1em" />}
      <span>{text}</span>
    </ButtonStyled>
  );
};

const ButtonStyled = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 20px;
  border-radius: 14pt;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 0.7em;
`;

export default Button;
