"use client";

import React from "react";
import styled from "styled-components";
import { useFetchData } from "@/hooks/useFetchData";
import LoadingWrapper from "@/components/common/LoadingWrapper";
import { useAuthLayoutContext, IAuthLayout } from "../../layout";
import Table from "./Table";

const DriverList = () => {
  const loggedUser: IAuthLayout | null = useAuthLayoutContext();

  const {
    data: list,
    error,
    isLoading,
    refreshData,
  } = useFetchData(
    `/api/v1/users/all/driver/company/${loggedUser?.company?.id}`
  );

  return (
    <RequestStyled>
      <LoadingWrapper
        isLoading={isLoading || !list}
        error={error}
        style={{ height: "100%" }}
      >
        {list?.data && (
          <Table
            list={list.data}
            refresh={refreshData}
            companyId={loggedUser?.company?.id}
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

export default DriverList;
