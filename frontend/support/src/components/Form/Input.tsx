import React from "react";
import styled from "styled-components";

type InputProps = {
  label: string;
  type: string;
  accept?: string;
  value?: string | number;
  name?: string;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({ label, containerStyle, ...inputProps }: InputProps) => {
  return (
    <InputStyled style={containerStyle}>
      <label>{label}</label>
      <input {...inputProps} />
    </InputStyled>
  );
};

const InputStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  label {
    font-weight: 600;
    font-size: 0.9em;
    user-select: none;
  }
  input {
    padding: 8px 10px;
    border: 2px solid #f3f4f6;
    border-radius: 5px;
    font-weight: 400;
    transition: border-color 0.25s linear;
    &:focus {
      border-color: #000;
    }
  }

  input[type="file"]::file-selector-button {
    background-color: #000;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    user-select: none;
  }
`;

export default Input;
