import { useEffect } from "react";
import usePostFetch from "../../hooks/usePostFetch";
import Form from "./Form";
import LoadingWrapper from "../../components/LoadingWrapper";
import { useFetchMultipleData } from "../../hooks/useFetchMultipleData";
import { UserFetchedData } from "./model";

const token = "32ddd6e7-042b-4a60-91d5-26e4e8d97757";

function DataForm() {
  const {
    response: userFetchedData,
    error: userFetchedDataError,
    isLoading: isUserFetchedDataLoading,
  } = usePostFetch<UserFetchedData>("api/v1/auth/verify-info", { token });

  const {
    data: formSelectData,
    isAnyLoading,
    isAnyError,
  } = useFetchMultipleData([
    { url: "api/v1/assistance/colors", key: "colors" },
    { url: "api/v1/assistance/types", key: "types" },
    { url: "api/v1/assistance/drive-train-types", key: "driveTrainTypes" },
    { url: "api/v1/assistance/engine-type", key: "engineTypes" },
    { url: "api/v1/assistance/insurances", key: "insurances" },
    { url: "api/v1/assistance/countries", key: "countries" },
    { url: "api/v1/assistance/weights", key: "weights" },
    { url: "api/v1/assistance/makes", key: "makes" },
  ]);

  useEffect(() => {
    console.log({ userFetchedData });
  }, [userFetchedData]);

  const isLoading = isUserFetchedDataLoading || isAnyLoading;
  const error = isAnyError || userFetchedDataError;

  return (
    <LoadingWrapper
      error={error}
      isLoading={isLoading}
      style={{
        height: "100vh",
      }}
    >
      {(!isLoading || !error) && userFetchedData && (
        <Form
          userFetchedData={userFetchedData}
          formSelectData={formSelectData}
        />
      )}
    </LoadingWrapper>
  );
}

export default DataForm;
