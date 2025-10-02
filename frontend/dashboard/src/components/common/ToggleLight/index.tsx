import React from "react";
import styled from "styled-components";
import { useTheme } from "@/context/theme";

const ToggleLight = () => {
  const { toggleTheme, theme } = useTheme();

  return (
    <ToggleLightStyled
      role="button"
      $isLight={theme === "light"}
      onClick={toggleTheme}
    >
      <span className="icon moon">🌙</span>
      <span className="icon sun">☀️</span>
      <div className="trigger" />
    </ToggleLightStyled>
  );
};

const ToggleLightStyled = styled.div<{ $isLight: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  width: 45px;
  height: 22.5px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  user-select: none;
  overflow: hidden;
  .icon {
    transition: all 0.25s ease-out;
    &.moon {
      font-size: ${({ $isLight }) => ($isLight ? ".3em" : ".8em")};
    }
    &.sun {
      font-size: ${({ $isLight }) => ($isLight ? ".8em" : ".3em")};
    }
  }
  .trigger {
    position: absolute;
    left: 3px;
    top: 3px;
    height: calc(100% - 6px);
    width: calc(50% - 6px);
    background-color: white;
    border-radius: 50%;
    transform: ${({ $isLight }) =>
      $isLight ? "translateX(0)" : "translateX(calc(100% + 6px))"};
    transition: transform 0.25s ease-out;
  }
`;

export default ToggleLight;
