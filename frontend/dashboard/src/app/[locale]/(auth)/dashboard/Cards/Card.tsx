"use client";

import React from "react";
import styled from "styled-components";
import { useTheme } from "@/context/theme";
import { IconType } from "react-icons/lib";
import CustomLink from "@/components/common/CustomLink";

interface CardProps {
  name: string;
  link: string;
  Icon: IconType;
  children: React.ReactElement;
}

const Card = ({ name, children, link, Icon }: CardProps) => {
  const { theme } = useTheme();

  return (
    <CustomLink href={link}>
      <CardStyled $isLight={theme === "light"} className="option">
        <div className="header">
          <div className="circle">
            <Icon />
          </div>
          <span>{name}</span>
        </div>
        <div className="status-wrapper">{children}</div>
        {/* <p className="see-more">Ver más</p> */}
      </CardStyled>
    </CustomLink>
  );
};

const CardStyled = styled.div<{ $isLight: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  border-radius: 5px 5px 40px 5px;
  background-color: transparent;
  color: #000;
  user-select: none;
  cursor: pointer;
  transition: all 0.25s linear;

  .header {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.65em;
    color: ${({ theme }) => theme.color};
    transition: color 0.25s linear;
    .circle {
      display: grid;
      place-items: center;
      padding: 10px;
      background-color: ${({ theme }) => theme.colors.primary};
      border-radius: 50%;
      transition: all 0.25s linear;
      svg {
        font-size: 2em;
        color: #fff;
        transition: all 0.25s linear;
      }
    }
  }
  .status-wrapper {
    margin: 20px 0;
    color: ${({ theme }) => theme.color};

    .ball {
      display: inline-block;
      margin-right: 5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #89cff0;
    }
    .status {
      font-size: 0.55em;
      font-weight: 900;
      > span {
        font-weight: 500;
        opacity: 0.4;
      }
    }
  }
  .see-more {
    text-align: right;
    margin-top: auto;
    font-size: 0.7em;
    text-decoration: underline;
    color: #fff;
  }

  .status-wrapper,
  .see-more {
    /* opacity: 0; */
    transition: all 0.25s linear;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ $isLight }) =>
      $isLight
        ? "5px 5px 5px 0px rgba(0, 0, 0, 0.1)"
        : "5px 5px 5px 0px rgba(255, 255, 255, 0.1)"};
    transform: scale(1.04);
    .header {
      color: #fff;

      .circle {
        background-color: #fff;

        svg {
          color: ${({ theme }) => theme.colors.primary};
        }
      }
    }
    .status-wrapper,
    .see-more {
      color: ${({ theme, $isLight }) =>
        $isLight ? theme.invertedColor : "#fff"};
      opacity: 1;
    }
  }

  @media (max-width: 600px) {
    background-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ $isLight }) =>
      $isLight
        ? "5px 5px 5px 0px rgba(0, 0, 0, 0.1)"
        : "5px 5px 5px 0px rgba(255, 255, 255, 0.1)"};
    .header {
      color: #fff;

      .circle {
        background-color: #fff;

        svg {
          color: ${({ theme }) => theme.colors.primary};
        }
      }
    }
    .status-wrapper,
    .see-more {
      color: #fff;
      opacity: 1;
    }
  }
`;

export default Card;
