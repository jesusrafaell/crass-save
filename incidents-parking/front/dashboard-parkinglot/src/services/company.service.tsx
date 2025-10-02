import api from "@/api";
import { companyUrl } from "@/api/endpoints";
import { Company, IError, IErrors } from "@/interfaces/auth";

import { AxiosError, AxiosResponse } from "axios";

const getById = async (id: string): Promise<Company> => {
  try {
    const url = companyUrl + "/" + id;
    const res = await api
      .get(url)
      .then((res: AxiosResponse<{ data: Company }>) => res.data);
    return res.data;
  } catch (error) {
    const _error = error as AxiosError<{ error: string }>;
    if (_error.response && _error.response.data.error) {
      throw new Error(_error.response.data.error);
    }
    throw new Error("Error al get company");
  }
};

const companyService = {
  get: getById,
};

export default companyService;
