import { capitalize } from '@mui/material';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

interface CreateModalProps {
	isOpen: boolean;
	isLoading: boolean;
	onClose: () => void;
	onCreate: (data: { [key: string]: string }) => void;
	title: string;
	fields: { label: string; name: string }[];
}

const CreateModal: FC<CreateModalProps> = ({ isOpen, isLoading, onClose, onCreate, title, fields }) => {
	const t = useTranslations('App');
	const t2 = useTranslations('drivers');
	const initialFormData = Object.fromEntries(fields.map((field) => [field.name, ''])); // Inicializa formData con valores vacíos para cada campo
	const [formData, setFormData] = useState<{ [key: string]: string }>(initialFormData);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onCreate(formData);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalContent>
				<ModalHeader className='text-white text-2xl text-center justify-center'>{title}</ModalHeader>
				<ModalBody>
					<form className='grid grid-cols-1 gap-4' onSubmit={handleSubmit}>
						{fields.map((field) => (
							<Input
								type={field.name}
								key={field.name}
								label={field.label}
								name={field.name}
								value={formData[field.name]}
								onChange={handleChange}
							/>
						))}
					</form>
				</ModalBody>
				<ModalFooter>
					<Button color='danger' variant='light' onClick={onClose}>
						{capitalize(t('cancel'))}
					</Button>
					<Button color='primary' onClick={handleSubmit} isLoading={isLoading}>
						{t2('register')}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CreateModal;
