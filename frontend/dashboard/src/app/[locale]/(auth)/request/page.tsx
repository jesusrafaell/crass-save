"use client";

import React, { useEffect } from "react";
import { useAuthLayoutContext, IAuthLayout } from "../layout";
import styled from "styled-components";
import { useFetchData } from "@/hooks/useFetchData";
import LoadingWrapper from "@/components/common/LoadingWrapper";
import Table from "./Table";
import { useRouter, useSearchParams } from "next/navigation";
import { IRequestAssistence } from "@/models/request";
import { CloudCog } from "lucide-react";

const Request = () => {
  const login: IAuthLayout | null = useAuthLayoutContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status");

  const validStatuses = ["pending", "completed", "cancelled", "active"];
  const isValidStatus = status && validStatuses.includes(status);

  // Si status no es válido, eliminarlo de la URL
  useEffect(() => {
    if (status && !isValidStatus) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("status");

      // Actualizar la URL sin recargar la página
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [status, isValidStatus, searchParams, router]);

  const url = `/api/v1/assistance/requests/company/${login?.company?.id}${
    isValidStatus ? `?status=${status}` : ""
  }`;

  const {
    data: list,
    error,
    isLoading,
    refreshData,
  } = useFetchData<{ data: IRequestAssistence[] }>(url);

  console.log(list?.data[0]);

  return (
    <RequestStyled>
      <LoadingWrapper
        isLoading={isLoading || !list}
        error={error}
        style={{ height: "100%" }}
      >
        {list?.data && <Table list={list.data} />}
      </LoadingWrapper>
    </RequestStyled>
  );
};

const RequestStyled = styled.section`
  position: relative;
  height: 100%;
  .request-header {
    display: flex;
    align-items: center;
    svg {
      margin-left: 100px;
    }
  }
`;

export default Request;
