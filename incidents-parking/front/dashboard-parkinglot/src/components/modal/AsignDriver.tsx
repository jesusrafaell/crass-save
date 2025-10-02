'use client';

import { Company, IBooking } from '@/interfaces/booking';
import { IActionResp } from '@/interfaces/globalContext';
import { Data } from '@/interfaces/truck';
import boookingService from '@/services/booking.service';
import truckService from '@/services/truck.service';
import { RootState } from '@/store';
import { capitalize } from '@mui/material';
import { Button, Popover, PopoverContent, PopoverTrigger, Select, SelectItem } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { ChangeEvent, Dispatch, FC, SetStateAction, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ModalUI from './ModalUI';

interface Props {
	isOpen: boolean;
	setupdated: Dispatch<SetStateAction<boolean>>;
	onClose: () => void;
	selectedBooking: IBooking | null;
}
const AsignDriver: FC<Props> = ({ isOpen, onClose, selectedBooking, setupdated }) => {
	const t = useTranslations('App');
	const t2 = useTranslations('App.Modals');
	const t3 = useTranslations('App.SideBar');

	const [isLoading, setisLoading] = useState(false);
	const [drivers, setDrivers] = useState<Data[]>([]);
	const [respUpdate, setrespUpdate] = useState<IActionResp | null>(null);
	const [driverSelected, setdriverSelected] = useState<string | null>(null);

	const { user } = useSelector((state: RootState) => state.auth);

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		const driverSelected = drivers.find((s) => s.id === value);
		setdriverSelected(driverSelected ? driverSelected.id : null);
	};

	const handleAsignDriver = async () => {
		setisLoading(true);
		if (!driverSelected) return;
		if (!selectedBooking) return;
		try {
			const bookingId = selectedBooking.id;
			const resp = await boookingService.asign(driverSelected, bookingId);
			setrespUpdate(resp);
			setisLoading(false);
			setupdated(true);
			if (resp && resp.ok) {
				setTimeout(() => {
					onClose();
				}, 1500);
			}
		} catch (error) {
			setupdated(false);
			setisLoading(false);
			console.log('error handleUpdateStatus', error);
		}
	};

	useLayoutEffect(() => {
		setisLoading(true);
		if (!user) return;
		const { id } = user.info as Company;
		truckService
			.getTrucksByCompanyId(id)
			.then((data) => {
				setDrivers(data);
				setisLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setisLoading(false);
			});
	}, [user, user?.info.id]);

	if (!selectedBooking) return;

	return (
		<ModalUI isOpen={isOpen} size='lg' onClose={onClose} title={`${t2('asigndriver')}`}>
			<div className='dark flex flex-col gap-4 items-center justify-center'>
				<Select label={capitalize(t3('driver'))} isRequired onChange={handleChange}>
					{drivers.map((status) => (
						<SelectItem key={status.id} value={status.id}>
							{capitalize(`${status.first_name} ${status.last_name}`)}
						</SelectItem>
					))}
				</Select>
				<Popover
					isOpen={respUpdate !== null}
					color={!respUpdate ? 'default' : respUpdate.ok ? 'success' : 'danger'}
					placement='top'
					onOpenChange={(open) => {
						setrespUpdate(null);
					}}>
					<PopoverTrigger>
						<Button size='lg' color='success' onClick={handleAsignDriver} isLoading={isLoading}>
							{capitalize(t('update'))}
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<div className='px-1 py-2'>
							<div className='text-small font-bold'>{respUpdate?.message}</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</ModalUI>
	);
};

export default AsignDriver;
