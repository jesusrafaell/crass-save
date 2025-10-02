import api from "@/api";
import { loginParking, userUrl } from "@/api/endpoints";
import getErrorDescription, {
  isIErrors,
  mantainanceError,
} from "@/api/errorsList";
import {
  IError,
  IErrors,
  IParkingLogin,
  ITypeLogin,
  UserState,
} from "@/interfaces/auth";
import { capitalize } from "@mui/material";
import { AxiosError, AxiosResponse } from "axios";

const loginService = async (
  email: string,
  password: string,
  svc: ITypeLogin
): Promise<UserState> => {
  try {
    // const res: AxiosResponse<IParkingLogin> = await api.post(loginParking, {
    //   email,
    //   password,
    //   svc,
    //   so: "web",
    // });
    // const { user, access_token, company, parking } = res.data;
    return {
      user: null,
      token: "",
      // info: svc === "company" ? company! : parking!,
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
      if (_error.status === 502) {
        throw new Error(mantainanceError);
      }
      if (normalizedCode === "R000E") {
        throw new Error("Email or Password invalid", { cause: normalizedCode });
      } else if (normalizedCode) {
        throw new Error("You do not have permission", {
          cause: normalizedCode,
        });
      }
      throw new Error(message, { cause: normalizedCode });
    }
    throw new Error("Error in Crashsaver");
  }
};

const getDataUserService = async (): Promise<any> => {
  try {
    // const res: AxiosResponse<any> = await api.get('');
    // return res.data;

    const res: AxiosResponse<any> = await api.get(userUrl);
    console.log({ res });

    return "";
  } catch (error) {
    throw new Error(mantainanceError);
  }
};

const authService = {
  login: loginService,
  getUser: getDataUserService,
};

export default authService;
