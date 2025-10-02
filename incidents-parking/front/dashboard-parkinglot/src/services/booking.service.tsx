import api from "@/api";
import { bookingUrl } from "@/api/endpoints";
import getErrorDescription, { isIErrors } from "@/api/errorsList";
import { IError, IErrors } from "@/interfaces/auth";
import {
  IBookingsTypes,
  IBookingsTypesJson,
  INewBooking,
  IParkingListResp,
} from "@/interfaces/booking";
import { IActionResp } from "@/interfaces/globalContext";
import { capitalize } from "@mui/material";

import { AxiosError, AxiosResponse } from "axios";

const createBooking = async (data: INewBooking): Promise<IActionResp> => {
  try {
    const res: AxiosResponse<IActionResp> = await api.post(bookingUrl, data);
    return res.data;
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
      const data = _error.response.data as IError;
      const message = getErrorDescription(data.error);
      throw new Error(message, { cause: data.error });
    }
    throw new Error("Error al realizar la reserva");
  }
};

const getAllBookings = async (type: IBookingsTypesJson) => {
  try {
    const params = new URLSearchParams();

    if (type.companyId) {
      params.append("companyId", type.companyId);
    }
    if (type.all) {
      params.append("all", "true");
    }
    if (type.licensePlate) {
      params.append("licensePlate", type.licensePlate);
    }
    if (type.parkingId) {
      params.append("parkingId", type.parkingId);
    }
    if (type.userId) {
      params.append("userId", type.userId);
    }

    const url = `${bookingUrl}/data?${params.toString()}`;
    const res = await api
      .get(url)
      .then((res: AxiosResponse<IParkingListResp>) => res.data);
    // console.log('getAllBookings', res.data);
    return res.data;
  } catch (error) {
    const _error = error as AxiosError<{ error: string }>;
    if (_error.response && _error.response.data.error) {
      throw new Error(_error.response.data.error);
    }
    throw new Error("Error al get");
  }
};

const asignDriver = async (driverId: string, bookingId: string) => {
  try {
    const url = bookingUrl + "/asignate";
    return await api
      .post(url, { driverId, bookingId })
      .then((res: AxiosResponse<IActionResp>) => res.data);
  } catch (error) {
    const _error = error as AxiosError<{ error: string }>;
    if (_error.response && _error.response.data.error) {
      throw new Error(_error.response.data.error);
    }
    throw new Error("Error al asignDriver");
  }
};

const boookingService = {
  create: createBooking,
  getAll: getAllBookings,
  asign: asignDriver,
};

export default boookingService;
