import React, { forwardRef } from "react";
import Card from "./Card";
import styled from "styled-components";
import { CardsProps } from "./data";

const Cards = ({ cards, cardProps, link, children }: CardsProps) => {
  return (
    <CardsStyled>
      <div className="options-wrapper">
        <div className="options">
          {cards &&
            Object.entries(cards).map(([key, value]) => {
              const total = cards.total;
              const param = key == "total" ? "" : `?status=${key}`;
              return (
                <Card key={key} link={`${link}${param}`} {...cardProps[key]}>
                  <>
                    <div className="ball" />
                    <span className="status">
                      {key === "total" ? (
                        `Total: ${value}`
                      ) : (
                        <>
                          Total: {value}
                          {"  "}
                          <span>
                            | Porcentaje:{" "}
                            {((Number(value) * 100) / Number(total)).toFixed(2)}
                            %
                          </span>
                        </>
                      )}
                    </span>
                  </>
                </Card>
              );
            })}
        </div>
      </div>
      {children}
    </CardsStyled>
  );
};

const CardsStyled = styled.div`
  padding-bottom: 30px;

  .options-wrapper {
    position: relative;
    margin-top: 30px;

    h3 {
      margin-bottom: 30px;
      font-weight: 800;
      text-align: center;
    }

    .options {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-auto-rows: minmax(100px, auto);
      gap: 20px;

      @media (max-width: 800px) {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
      @media (max-width: 500px) {
        grid-template-columns: 1fr;
      }
    }
  }
`;

export default Cards;
