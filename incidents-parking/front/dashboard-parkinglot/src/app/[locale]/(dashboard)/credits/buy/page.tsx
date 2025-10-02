/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import PrivatePolicyModal from '@/components/modal/PrivatePolicyModal';
import GlobalContext from '@/context/Global';
import { Company } from '@/interfaces/auth';
import { IPayloadCredits } from '@/interfaces/credits';
import creditsService from '@/services/credits.service';
import { RootState } from '@/store';
import { capitalize } from '@mui/material';
import { Button, Input, Radio, RadioGroup, RadioProps, Skeleton, Textarea, cn } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useContext, useMemo, useState } from 'react';
import { TbCircleLetterS } from 'react-icons/tb';
import { useSelector } from 'react-redux';

interface IOptions {
	desc: string;
	value: number;
	name: string;
}
const Buy = () => {
	const t = useTranslations('App');
	const t3 = useTranslations('credits.buy');
	const { user } = useSelector((state: RootState) => state.auth);
	const { products } = useContext(GlobalContext);
	const [disabledButton, setdisabledButton] = useState(true);
	const [customVal, setcustomVal] = useState<string | undefined>();
	const [description, setdescription] = useState<string>('');
	const [optionSelected, setoptionSelected] = useState<string | undefined>();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleOpenModal = () => {
		setIsOpen(prev => !prev)
	}
	const { push, refresh } = useRouter();

	//UI
	const [loading, setloading] = useState(false);

	const CustomRadio = (props: RadioProps) => {
		const { children, ...otherProps } = props;

		return (
			<Radio
				{...otherProps}
				classNames={{
					base: cn(
						'inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between',
						'flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-8 p-4 border-2 border-transparent',
						'data-[selected=true]:border-success',
					),
				}}>
				{children}
			</Radio>
		);
	};

	const isDisabled = () => {
		if (optionSelected === capitalize(t3('custom'))) {
			const cond = customVal === undefined || customVal === '' || Number(customVal) < 500;
			setdisabledButton(cond);
			return;
		}
		setdisabledButton(optionSelected === undefined);
	};

	// const handlePayload = () => {
	// 	const optionAux = products.find((v) => v.name === optionSelected);
	// 	setpayload(optionAux);
	// };

	const handlePaymentCredits = async () => {
		setloading(true);
		const producto = products.find((p) => p.name === optionSelected);
		if (!producto || !user) return;
		const { user: userData, info } = user;
		const { id } = info as Company;

		const payload: IPayloadCredits = {
			description,
			productId: producto.id,
			companyId: id,
			userId: userData.id,
		};
		try {
			const url = await creditsService.buyCredits(payload).finally(() => setloading(false));

			push(url);
			refresh();
		} catch (error) {
			console.error(error);
		}
	};
	const handleClose = () => {
		setIsOpen(prev => !prev)
	}

	useMemo(() => {
		isDisabled();
	}, [optionSelected]);

	return (
		<>
			<div className='w-full h-full flex flex-col px-8 gap-4 justify-center items-center'>
				<h1 className='text-4xl text-center'>{t3('planstitle')}</h1>
				<div className='flex flex-col gap-8 w-full items-center justify-center'>
					<RadioGroup
						className='items-center justify-center gap-8'
						classNames={{
							wrapper: 'grid grid-cols-2',
						}}
						label={<p className='text-2xl text-center'>{t3('selectPlan')}</p>}
						value={optionSelected}
						onValueChange={setoptionSelected}>
						{products.length > 0
							? products.map((option, i) => (
									<CustomRadio
										key={i}
										value={option.name}
										description={
											<p className='text-lg'>
												{option.credits + ' ' + t3.rich('credits', { count: Number(option.credits) })}
											</p>
										}>
										<p className='text-lg lg:text-xl font-bold'>{capitalize(option.name)}</p>
									</CustomRadio>
							  ))
							: [1, 2, 3, 4, 5, 6, 7].map((i) => (
									<Skeleton className='rounded-lg' key={i}>
										<CustomRadio
											className='lg:w-[227px] lg:h-[92px] w-[150px] h-[120px]'
											key={i}
											value={''}
											description={<p className='text-lg'></p>}>
											<p className='text-lg lg:text-xl font-bold'>{''}</p>
										</CustomRadio>
									</Skeleton>
							  ))}
					</RadioGroup>
					<Textarea
						isInvalid={description.length > 255}
						className='max-w-md'
						label={capitalize(t3('description'))}
						onValueChange={setdescription}
						value={description}
						errorMessage={description.length > 255 ? t3.rich('errormessage', { number: 255 }) : undefined}
					/>
					{optionSelected === capitalize(t3('custom')) && (
						<Input
							type='number'
							classNames={{
								base: cn('max-w-[300px] text-lg'),
								mainWrapper: cn('p-8'),
							}}
							label={capitalize(t('amount'))}
							step={500}
							min={1000}
							value={customVal}
							onValueChange={setcustomVal}
							startContent={
								<div className='pointer-events-none flex items-center'>
									<span className='text-default-400 text-small'>€</span>
								</div>
							}
						/>
					)}

					<PrivatePolicyModal acceptRequired={true} isOpen={isOpen} handleModal={handlePaymentCredits} onClose={handleClose} isLoading={loading} />
					<Button
						isLoading={loading}
						isDisabled={isOpen}
						className='bg-success-200 text-foreground text-xl px-8 rounded-lg'
						onClick={handleOpenModal}
						startContent={<TbCircleLetterS width={24} height={24} />}>
						{t3('checkout')}
					</Button>
				</div>
			</div>
		</>
	);
};

export default Buy;
