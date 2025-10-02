import requestService from '@/services/requests.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useGetAllRequest = () => {
	return useMutation({
		mutationFn: requestService.getAll,
		mutationKey: ['REQUEST_ALL'],
		onSuccess: async (data) => {
			// console.log('useGetAllRequest', data);
			return data;
		},
		onError: (error) => {
			// console.log('error in mutation login', error);
			toast.error(error?.message);
		},
	});
};

export const useGetRequestByID = (id: string, from: 'reqId' | 'driverId') => {
	return useQuery({ queryKey: ['REQUEST_BY_ID', id, from], queryFn: () => requestService.getByID(id, from) });
};
