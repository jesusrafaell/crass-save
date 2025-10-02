'use client';
import { Card } from '@nextui-org/react';
import { FC, ReactNode } from 'react';
interface IProps {
	children: ReactNode;
	col?: number;
	row?: number;
	className?: string;
}
const BentoCard: FC<IProps> = ({ col = 1, row = 1, className = undefined, children }) => {
	let columns = 'lg:col-span-1';
	let rows = 'lg:row-span-1';

	switch (col) {
		case 2:
			columns = 'lg:col-span-2';
			break;
		case 3:
			columns = 'lg:col-span-3';
			break;
		case 4:
			columns = 'lg:col-span-4';
			break;
		case 5:
			columns = 'lg:col-span-5';
			break;
		case 6:
			columns = 'lg:col-span-6';
			break;
		case 7:
			columns = 'lg:col-span-7';
			break;
		case 8:
			columns = 'lg:col-span-8';
			break;
		case 9:
			columns = 'lg:col-span-9';
			break;
		case 10:
			columns = 'lg:col-span-10';
			break;
		case 11:
			columns = 'lg:col-span-11';
			break;
		case 12:
			columns = 'lg:col-span-12';
			break;
		default:
			columns = 'lg:col-span-1';
			break;
	}
	switch (row) {
		case 2:
			rows = 'lg:row-span-2';
			break;
		case 3:
			rows = 'lg:row-span-3';
			break;
		case 4:
			rows = 'lg:row-span-4';
			break;
		case 5:
			rows = 'lg:row-span-5';
			break;
		case 6:
			rows = 'lg:row-span-6';
			break;
		case 7:
			rows = 'lg:row-span-7';
			break;
		case 8:
			rows = 'lg:row-span-8';
			break;
		case 9:
			rows = 'lg:row-span-9';
			break;
		case 10:
			rows = 'lg:row-span-10';
			break;
		case 11:
			rows = 'lg:row-span-11';
			break;
		case 12:
			rows = 'lg:row-span-12';
			break;
		default:
			rows = 'lg:row-span-1';
			break;
	}
	return (
		<Card className={`${col ? columns : ''} ${row ? rows : ''} col-span-1 ${className ? className : ''}`}>
			{children}
		</Card>
	);
};

export default BentoCard;
