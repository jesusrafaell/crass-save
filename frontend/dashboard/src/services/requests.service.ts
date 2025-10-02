import api from '@/api';
import { requestUrl } from '@/api/endpoints';
import { IRequest, IResp } from '@/models';
import getErrorDescription, { mantainanceError } from '@/utils/errorsList';
import { AxiosError, AxiosResponse } from 'axios';

const getAllRequest = async (): Promise<IRequest[]> => {
	try {
		const res: AxiosResponse<IResp<IRequest[]>> = await api.get(requestUrl + '/all');
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

const getRequestByID = async (id: string, from: 'reqId' | 'driverId'): Promise<IRequest> => {
	try {
		const res: AxiosResponse<IResp<IRequest>> = await api.get(requestUrl + `/filter?${from}=${id}`);
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

const requestService = {
	getAll: getAllRequest,
	getByID: getRequestByID,
};

export default requestService;
