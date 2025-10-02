'use client';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';

import { FC, ReactNode } from 'react';

interface PropsModal {
	children: ReactNode;
	isOpen: boolean;
	onClose: () => void;
	onOpenChange?: () => void;
	size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
	title?: string;
}

const ModalUI: FC<PropsModal> = ({ children, onClose, isOpen, onOpenChange, title = '', size }) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			onOpenChange={onOpenChange}
			placement='center'
			size={size}
			classNames={{
				base: 'bg-content1 text-foreground',
			}}
			backdrop='blur'>
			<ModalContent>
				<ModalHeader className='flex flex-col gap-1 font-bold text-3xl text-center'>{title}</ModalHeader>
				<ModalBody className='px-6 py-4'>{children}</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ModalUI;
