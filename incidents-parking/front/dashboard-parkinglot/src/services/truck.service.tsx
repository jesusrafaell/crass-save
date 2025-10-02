import api from '@/api';
import { baseEPUrl, truckAdd, truckListbyCompID } from '@/api/endpoints';
import getErrorDescription, { mantainanceError } from '@/api/errorsList';
import { IGetAll, IRegisterTruckDriver } from '@/interfaces/truck';
import { AxiosError, AxiosResponse } from 'axios';

const getTrucksByCompanyId = async (companyId: string) => {
	try {
		const res = await api.get(truckListbyCompID + companyId).then((res: AxiosResponse<IGetAll>) => res.data);
		return res.data;
	} catch (error) {
		const _error = error as AxiosError<{ error: string }>;
		if (_error.response && _error.response.data.error) {
			const message = getErrorDescription(_error.response.data.error);
			throw new Error(message, { cause: _error.response.data.error });
		}
		throw new Error(mantainanceError);
	}
};

const addTruck = async (email: string, companyId: string) => {
	try {
		const res: AxiosResponse<{
			data: IRegisterTruckDriver;
			ok: boolean;
		}> = await api.post(truckAdd, { email, companyId });
		return res.data;
	} catch (error) {
		const _error = error as AxiosError<{ error: string }>;
		if (_error.response && _error.response.data.error) {
			const message = getErrorDescription(_error.response.data.error);
			throw new Error(message, { cause: _error.response.data.error });
		}
		throw new Error(mantainanceError);
	}
};

const verifyTruckToken = async (companyId: string, token: string) => {
	try {
		const url = `${baseEPUrl}/users/verify-token/verify-truck`;
		const res = await api.post(url, { companyId, token });
		return res.data;
	} catch (error) {
		const _error = error as AxiosError<{ error: string }>;
		if (_error.response && _error.response.data.error) {
			const message = getErrorDescription(_error.response.data.error);
			throw new Error(message, { cause: _error.response.data.error });
		}
		throw new Error(mantainanceError);
	}
};

const truckService = {
	getTrucksByCompanyId,
	addTruck,
	verifyTruckToken,
};

export default truckService;
