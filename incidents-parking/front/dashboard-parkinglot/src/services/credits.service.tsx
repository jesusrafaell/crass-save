import api from '@/api';
import { buyProductsUrl } from '@/api/endpoints';
import getErrorDescription, { isIErrors } from '@/api/errorsList';
import { IError, IErrors } from '@/interfaces/auth';
import { IPayloadCredits } from '@/interfaces/credits';
import { IBuyCreditsResp } from '@/interfaces/globalContext';
import { capitalize } from '@mui/material';
import { AxiosError, AxiosResponse } from 'axios';

const buyCredits = async (data: IPayloadCredits): Promise<string> => {
	try {
		const res: AxiosResponse<IBuyCreditsResp> = await api.post(buyProductsUrl, data);
		return res.data.data.challengeUrl;
	} catch (error) {
		const _error = error as AxiosError<IError | { errors: IErrors[] }>;
		if (_error.response && _error.response.data) {
			if (isIErrors(_error.response.data)) {
				const data = _error.response.data as { errors: IErrors[] };
				const errors = data.errors;
				const messages = errors
					.map((e) => `${capitalize(e.path.replace('/', ''))}: ${getErrorDescription(e.code)}`)
					.join(' ');
				throw new Error(messages, { cause: errors });
			}
			const data = _error.response.data as IError;
			const message = getErrorDescription(data.error);
			if (message?.includes('Service in Maintenance')) {
				throw new Error('Error paying credits', { cause: data.error });
			}
			throw new Error(message, { cause: data.error });
		}
		throw new Error('Error paying credits general');
	}
};

const creditsService = {
	buyCredits,
};

export default creditsService;
