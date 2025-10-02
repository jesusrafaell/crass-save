"use client";

import React from "react";
import styled from "styled-components";
import { useFetchData } from "@/hooks/useFetchData";
import LoadingWrapper from "@/components/common/LoadingWrapper";
import TableMakes from "./TableMakes";
import TableTypes from "./TableTypes";
import { IBase, IBaseLang } from "@/models";

const TowTruckMakesList = () => {
  const {
    data: makeList,
    error: eMake,
    isLoading: eIsLoading,
    refreshData: eRefreshData,
  } = useFetchData<{ data: IBase[] }>(
    `/api/v1/assistance/tow-truck/makes/data`
  );

  const {
    data: craneTypeList,
    error: ctError,
    isLoading: ctIsLoading,
    refreshData: ctRefreshData,
  } = useFetchData<{ data: IBaseLang[] }>(
    `/api/v1/assistance/crane-types/data`
  );

  return (
    <RequestStyled>
      <LoadingWrapper
        isLoading={eIsLoading || ctIsLoading || !makeList || !craneTypeList}
        error={eMake || ctError}
        style={{ height: "100%" }}
      >
        <div className="lg:flex gap-3 jusitfy-center">
          {makeList?.data && (
            <TableMakes
              list={makeList.data}
              title="Marcas de Gruas"
              desc="Gestiona tus marcas disponibles."
              refresh={eRefreshData}
            />
          )}
          {craneTypeList?.data && (
            <TableTypes
              list={craneTypeList.data}
              title="Tipos de Gruas"
              desc="Gestiona tus tipos de gruas."
              handleDelete={() => {}}
              refresh={ctRefreshData}
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

export default TowTruckMakesList;
