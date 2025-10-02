"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { useFetchData } from "@/hooks/useFetchData";
import LoadingWrapper from "@/components/common/LoadingWrapper";
import { useAuthLayoutContext, IAuthLayout } from "../layout";
import Table from "./Table";
import { ICoin } from "@/models";
import { getCoins } from "@/api/endpoints";

const Rates = () => {
  const loggedUser: IAuthLayout | null = useAuthLayoutContext();

  const {
    data: dataCoins,
    // error: coinsError,
    // isLoading: coinsIsLoading,
  } = useFetchData<{ data: ICoin[] }>(getCoins);

  const {
    data: list,
    error,
    isLoading,
    refreshData,
  } = useFetchData(`/api/v1/assistance/rate-prices/types`);

  return (
    <RequestStyled>
      <LoadingWrapper
        isLoading={isLoading || !list}
        error={error}
        style={{ height: "100%" }}
      >
        {list?.data && (
          <Table
            data={list.data}
            refresh={refreshData}
            companyId={loggedUser?.company?.id}
            coins={dataCoins?.data || []}
          />
        )}
      </LoadingWrapper>
    </RequestStyled>
  );
};

const RequestStyled = styled.section`
  position: relative;
  height: 100%;
`;

export default Rates;
