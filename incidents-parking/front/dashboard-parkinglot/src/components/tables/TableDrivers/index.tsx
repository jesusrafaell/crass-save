import EditModal from '@/components/modal/EditDriver';
import { Company } from '@/interfaces/auth';
import { Data } from '@/interfaces/truck';
import truckService from '@/services/truck.service';
import { RootState } from '@/store';
import { capitalize } from '@mui/material';
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {}

export default function DriverTable(props: Props) {
	const t = useTranslations('App');
	const t2 = useTranslations('drivers');
	const [drivers, setDrivers] = useState<Data[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [editModalOpen, setEditModalOpen] = useState<boolean>(false); // Agrega el estado para el modal de edición
	const [selectedDriver, setSelectedDriver] = useState<any>(null);

	const { user } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		setLoading(true);
		setError(null);
		if (!user) return;
		const { id } = user.info as Company;
		truckService
			.getTrucksByCompanyId(id)
			.then((data) => {
				setDrivers(data);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setError(error.message);
				setLoading(false);
			});
	}, [user, user?.info.id]);

	const handleEdit = (driver: any) => {
		setSelectedDriver(driver);
		setEditModalOpen(true); // Abre el modal de edición cuando se hace clic en editar
	};

	const handleDelete = (driverId: string) => {
		console.log('Conductor borrado con ID:', driverId);
	};

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<>
			<Table
				aria-label='Tabla de conductores'
				classNames={{
					tbody: 'h-[380px]',
					table: 'min-h-[400px] w-full',
					td: 'text-center',
					th: 'text-center',
				}}>
				<TableHeader>
					<TableColumn>{capitalize(t('name'))}</TableColumn>
					<TableColumn>E-Mail</TableColumn>
					<TableColumn>{t2('mobile')}</TableColumn>
					<TableColumn>{t2('role')}</TableColumn>
					<TableColumn>{t2('status')}</TableColumn>
					{/* <TableColumn>{t2('actions')}</TableColumn> */}
				</TableHeader>
				<TableBody
					isLoading={loading}
					loadingContent={<Spinner color='default' label={`${capitalize(t2('tableloading'))}...`} />}>
					{drivers.map((driver) => (
						<TableRow key={driver.id} className='h-full'>
							<TableCell>{`${driver.first_name} ${driver.last_name}`}</TableCell>
							<TableCell>{driver.email}</TableCell>
							<TableCell>{driver.mobile}</TableCell>
							<TableCell>{driver.roles.map((role) => role.name).join(', ')}</TableCell>
							<TableCell>{capitalize(driver.status.name)}</TableCell>
							{/* <TableCell>
								<Button onClick={() => handleEdit(driver)} color='warning' className='w-8 px-0 min-w-0 mr-2'>
									<VscEdit size={15} />
								</Button>
								<Button onClick={() => handleDelete(driver.id)} className='w-8 px-0 min-w-0' color='danger'>
									<VscTrash size={15} />
								</Button>
							</TableCell> */}
						</TableRow>
					))}
				</TableBody>
			</Table>
			<EditModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} selectedDriver={selectedDriver} />
		</>
	);
}
