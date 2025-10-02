import api from "@/api";
import { authUrl, driverDataUrl, userDataUrl } from "@/api/endpoints";
import {
  ICompany,
  IDriverData,
  IError,
  IErrors,
  ILoginPayload,
  ILoginResponse,
  IUser,
} from "@/models";
import getErrorDescription, {
  isIErrors,
  mantainanceError,
} from "@/utils/errorsList";
import { capitalize } from "@/utils/functions";
import { AxiosError, AxiosResponse } from "axios";

const loginService = async (
  data: ILoginPayload
): Promise<{ user: IUser; company: ICompany; token: string }> => {
  try {
    const res: AxiosResponse<ILoginResponse> = await api.post(authUrl, {
      ...data,
      so: "web",
    });
    const { user, company, access_token } = res.data.data;
    return {
      user,
      company,
      token: access_token,
    };
  } catch (error) {
    const _error = error as AxiosError<IError | { errors: IErrors[] }>;
    if (_error.response && _error.response.data) {
      if (isIErrors(_error.response.data)) {
        const data = _error.response.data as { errors: IErrors[] };
        const errors = data.errors;
        const messages = errors
          .map(
            (e) =>
              `${capitalize(e.path.replace("/", ""))}: ${getErrorDescription(
                e.code
              )}`
          )
          .join(" ");
        throw new Error(messages, { cause: errors });
      }
      const error = _error.response.data as IError;
      const normalizedCode = error.error.trim().toUpperCase();
      const message = getErrorDescription(normalizedCode);
      if (normalizedCode === "R000E" || normalizedCode === "R023E") {
        throw new Error("Email or Password invalid", { cause: normalizedCode });
      }
      throw new Error(message, { cause: normalizedCode });
    }
    throw new Error(mantainanceError);
  }
};

const getDriverService = async (userId: string): Promise<IDriverData> => {
  try {
    const res: AxiosResponse<{ data: IDriverData }> = await api.get(
      driverDataUrl + userId
    );
    return res.data.data;
  } catch (error) {
    const _error = error as AxiosError<{ error: string }>;
    if (_error.response && _error.response.data.error) {
      const message = getErrorDescription(_error.response.data.error);
      throw new Error(message, { cause: _error.response.data.error });
    }
    throw new Error(mantainanceError);
  }
};

const getDataUserService = async (): Promise<ILoginResponse> => {
  try {
    const res: AxiosResponse<{ data: ILoginResponse }> = await api.get(
      userDataUrl
    );
    return res.data.data;
  } catch (error) {
    const _error = error as AxiosError<{ error: string }>;
    if (_error.response && _error.response.data.error) {
      const message = getErrorDescription(_error.response.data.error);
      throw new Error(message, { cause: _error.response.data.error });
    }
    throw new Error(mantainanceError);
  }
};

const authService = {
  login: loginService,
  getUser: getDataUserService,
  getDriver: getDriverService,
};

export default authService;
