"use client";

import React from "react";
import styled from "styled-components";
import { useFetchData } from "@/hooks/useFetchData";
import LoadingWrapper from "@/components/common/LoadingWrapper";
import Table from "./Table";
import { ICompanyData } from "@/models";

const CompaniesList = () => {
  const {
    data: list,
    error,
    isLoading,
    refreshData,
  } = useFetchData<{ data: ICompanyData[] }>(
    `/api/v1/assistance/companies/info`
  );

  return (
    <RequestStyled>
      <LoadingWrapper
        isLoading={isLoading || !list}
        error={error}
        style={{ height: "100%" }}
      >
        <div className="lg:flex gap-3 jusitfy-center">
          {list?.data && (
            <Table
              list={list.data}
              title="Empresas"
              desc="Gestiona tus empresas"
              refresh={refreshData}
            />
          )}
        </div>
      </LoadingWrapper>
    </RequestStyled>
  );
};

const RequestStyled = styled.section`
  position: relative;
  height: 100%;
`;

export default CompaniesList;
