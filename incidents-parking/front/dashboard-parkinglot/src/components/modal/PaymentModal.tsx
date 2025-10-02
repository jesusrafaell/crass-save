'use client';
import cartBack from '@/images/payment/card-visa-back.png';
import cartFront from '@/images/payment/card-visa-front.png';
import { Company, UserState } from '@/interfaces/auth';
import { Product } from '@/interfaces/booking';
import { IPayloadCredits } from '@/interfaces/credits';
import { IActionResp } from '@/interfaces/globalContext';
import companyService from '@/services/company.service';
import creditsService from '@/services/credits.service';
import { RootState } from '@/store';
import { refreshCompany } from '@/store/auth/authSlice';
import { capitalize } from '@mui/material';
import {
	Button,
	Input,
	Link,
	Modal,
	ModalContent,
	ModalFooter,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectItem,
} from '@nextui-org/react';
import { getCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
interface IProps {
	payload: Product | undefined;
	onClose: () => void;
	open: boolean;
	user: UserState | null;
}

const regex = /^[0-9]*$/;
const PaymentModal: FC<IProps> = ({ payload, onClose, open, user }) => {
	const t = useTranslations('App');
	const t2 = useTranslations('App.Modals');
	const t3 = useTranslations('credits.buy');

	//refresh company
	const dispatch = useDispatch();
	const { user: userContent } = useSelector((state: RootState) => state.auth);
	const role = getCookie('role');

	const [cardholder, setCardholder] = useState('');
	const [cardNumber, setCardNumber] = useState('');
	const [formatedcardNumber, setformatedCardNumber] = useState('');
	const [expiredMonth, setExpiredMonth] = useState('');
	const [expiredYear, setExpiredYear] = useState('');
	const [securityCode, setSecurityCode] = useState('');
	const [card, setCard] = useState('front');
	const currentYear = new Date().getFullYear();
	const [isLoading, setisLoading] = useState(false);
	const [showError, setShowError] = useState<Error>();
	const [respUpdate, setrespUpdate] = useState<IActionResp | null>(null);

	const formatCardNumber = (value: string) => {
		if (value.length > 19) {
			return;
		}
		const isValid = regex.test(value);
		const formattedValue = value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
		if (isValid) {
			setformatedCardNumber(formattedValue);
			setCardNumber(value);
		}
	};

	const isValid = () => {
		if (cardholder.length < 5) {
			return false;
		}
		if (cardNumber === '') {
			return false;
		}
		if (expiredMonth === '') {
			return false;
		}
		if (expiredYear === '') {
			return false;
		}
		if (securityCode.length !== 3) {
			return false;
		}
		return true;
	};

	const clearData = () => {
		setCardholder('');
		setCardNumber('');
		setformatedCardNumber('');
		setExpiredMonth('');
		setExpiredYear('');
		setSecurityCode('');
		setCard('front');
	};

	const onSubmit = async () => {
		if (!payload || !user) return;
		console.log('user', user);
		const { id } = user.info as Company;
		const { user: userData } = user;
		const data: IPayloadCredits = {
			companyId: id,
			description: payload.name,
			productId: payload.id,
			userId: userData.id,
		};
		try {
			const resp = await creditsService.buyCredits(data);
			// setrespUpdate(resp);
			setisLoading(false);
			if (role === 'company' && userContent) {
				const { id } = userContent.info;
				const resCompany = await companyService.get(id);
				dispatch(refreshCompany(resCompany));
			}
			clearData();
			setTimeout(() => {
				onClose();
			}, 500);
		} catch (error) {
			console.log(error);
			setrespUpdate(null);
			setShowError(error as Error);
			setisLoading(false);
		}
	};
	if (!payload) return;
	return (
		<>
			<Modal
				isOpen={open}
				onClose={onClose}
				size='2xl'
				backdrop='blur'
				// scrollBehavior='normal'
				motionProps={{
					variants: {
						enter: {
							y: 0,
							opacity: 1,
							transition: {
								duration: 0.3,
								ease: 'easeOut',
							},
						},
						exit: {
							y: -20,
							opacity: 0,
							transition: {
								duration: 0.2,
								ease: 'easeIn',
							},
						},
					},
				}}
				classNames={{
					base: 'w-full py-4 mx-auto rounded-xl',
					header: 'flex flex-col justify-center items-center',
					footer: 'py-4 px-6 justify-center flex flex-col items-center',
					closeButton: '',
				}}>
				<ModalContent>
					{(onClose) => (
						<>
							{/* <ModalHeader></ModalHeader> */}
							<div className='flex flex-col justify-center items-center'>
								<div className='sm:flex hidden h-[261px] w-[390px] justify-center items-center'>
									<div className={`relative ${card === 'front' ? 'block' : 'hidden'}`} key='front'>
										<Image className='min-w-[390px] w-full h-fit' src={cartFront} alt='front credit card' />
										<div className='front bg-transparent text-lg w-full text-white px-12 absolute left-0 bottom-12'>
											<p className='number mb-5 sm:text-xl'>
												{formatedcardNumber !== '' ? formatedcardNumber : '0000 0000 0000 0000'}
											</p>
											<div className='flex flex-row justify-between'>
												<p>{cardholder !== '' ? cardholder : capitalize(t2('cardholder'))}</p>
												<div>
													<span>{expiredMonth}</span>
													{expiredMonth !== '' && <span>/</span>}
													<span>{expiredYear}</span>
												</div>
											</div>
										</div>
									</div>
									{/* cartback */}
									<div className={`relative ${card === 'back' ? 'block' : 'hidden'}`} key='back'>
										<Image className='min-w-[390px] w-full h-fit' src={cartBack} alt='cartBack' />
										<div className='bg-transparent text-white text-xl w-full flex justify-end absolute bottom-20 px-8 sm:bottom-24 right-0 sm:px-12'>
											<div className='border border-white w-16 h-9 flex justify-center items-center'>
												<p>{securityCode !== '' ? securityCode : capitalize(t2('code'))}</p>
											</div>
										</div>
									</div>
								</div>
								<ul className='flex '>
									<li className='mx-2'>
										<img
											className='w-16'
											src='https://www.computop-paygate.com/Templates/imagesaboutYou_desktop/images/computop.png'
											alt=''
										/>
									</li>
									<li className='mx-2'>
										<img
											className='w-14'
											src='https://www.computop-paygate.com/Templates/imagesaboutYou_desktop/images/verified-by-visa.png'
											alt=''
										/>
									</li>
									<li className='ml-5'>
										<img
											className='w-7'
											src='https://www.computop-paygate.com/Templates/imagesaboutYou_desktop/images/mastercard-id-check.png'
											alt=''
										/>
									</li>
								</ul>
							</div>
							<div className='px-6 mt-6'>
								<h1 className='text-xl font-semibold text-white text-center capitalize'>
									{capitalize(t2('cardpayment'))}
								</h1>
								<div>
									<div className='my-3'>
										<Input
											type='text'
											className='block w-full px-5 rounded-lg p-0'
											label={capitalize(t('name'))}
											maxLength={22}
											value={cardholder}
											isClearable
											onClear={() => setCardholder('')}
											onChange={(e) => setCardholder(e.target.value)}
										/>
									</div>
									<div className='my-3'>
										<Input
											type='text'
											className='block w-full px-5 p-0 focus:ring focus:outline-none'
											label={capitalize(t2('cardnumber'))}
											value={cardNumber}
											isClearable
											onClear={() => {
												setCardNumber('');
												setformatedCardNumber('');
											}}
											onChange={(e) => formatCardNumber(e.target.value)}
											maxLength={19}
										/>
									</div>
									<div className='grid grid-cols-2 my-3 gap-4'>
										<div className='flex flex-col w-full'>
											<div className='mb-2'>
												<label htmlFor='' className='text-white'>
													{capitalize(t2('expireIn'))}
												</label>
											</div>
											<div className='flex justify-between w-full gap-2'>
												<Select
													label={capitalize(t('month'))}
													className='w-full px-5 p-0'
													value={expiredMonth}
													onChange={(e) => setExpiredMonth(e.target.value)}>
													{['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((mes) => (
														<SelectItem value={mes} key={mes}>
															{mes}
														</SelectItem>
													))}
												</Select>
												<Select
													label={capitalize(t('year'))}
													className='w-full px-5 p-0'
													value={expiredYear}
													onChange={(e) => setExpiredYear(e.target.value)}>
													{Array.from({ length: 11 }, (_, index) => (
														<SelectItem key={currentYear + index} value={currentYear + index}>
															{`${currentYear + index}`}
														</SelectItem>
													))}
												</Select>
											</div>
										</div>
										<div className='flex flex-col w-full'>
											<div className='mb-2'>
												<label htmlFor='' className='text-white'>
													{capitalize(t2('code'))}
												</label>
											</div>
											<div className='flex justify-between w-full'>
												<Input
													type='text'
													className='block w-full col-span-2 px-5 p-0'
													placeholder='CCV'
													maxLength={3}
													value={securityCode}
													onChange={(e) => {
														if (regex.test(e.target.value)) setSecurityCode(e.target.value);
													}}
													onFocus={() => setCard('back')}
													onBlur={() => setCard('front')}
												/>
											</div>
										</div>
									</div>
									<div className='mt-5 text-xs text-gray-400 dark:text-gray-500'>
										{t2.rich('agreement', {
											guidelines: (chunks) => <Link className='text-xs'>{chunks}</Link>,
										})}
									</div>
								</div>
							</div>
							<ModalFooter>
								<div className='w-full'>
									<div className='w-full flex justify-between py-1 text-gray-500 dark:text-gray-200 font-medium'>
										<div>{capitalize(t2('subtotal'))}</div>
										<div>€{payload.price}</div>
									</div>
									<div className='w-full flex justify-between py-1 text-gray-500 dark:text-gray-200 font-medium'>
										<div>IVA (X%)</div>
										<div>€0.00</div>
									</div>
									<div className='w-full flex justify-between py-1 text-gray-200 dark:text-gray-200 font-medium'>
										<div>{capitalize(t2('total'))}</div>
										<div>€{payload.price}</div>
									</div>
								</div>
								<Popover
									isOpen={respUpdate !== null || showError !== undefined}
									color={!showError ? (!respUpdate ? 'default' : respUpdate.ok ? 'success' : 'danger') : 'danger'}
									placement='top'
									onOpenChange={(open) => {
										setrespUpdate(null);
										setShowError(undefined);
									}}>
									<PopoverTrigger>
										<Button
											color='success'
											className={`p-4 mt-2 rounded-full w-full text-2xl font-semibold transition-colors ${
												!isValid() ? 'text-black' : 'text-white'
											}`}
											isLoading={isLoading}
											isDisabled={!isValid()}
											onClick={onSubmit}>
											{capitalize(t2('pay'))}
										</Button>
									</PopoverTrigger>
									<PopoverContent>
										<div className='px-1 py-2'>
											<div className='text-small font-bold'>
												{showError
													? capitalize(showError.message)
													: respUpdate
													? capitalize(respUpdate.ok ? respUpdate.message : '')
													: // ? capitalize(respUpdate.ok ? t3('purchased') : '')
													  undefined}
											</div>
										</div>
									</PopoverContent>
								</Popover>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default PaymentModal;
