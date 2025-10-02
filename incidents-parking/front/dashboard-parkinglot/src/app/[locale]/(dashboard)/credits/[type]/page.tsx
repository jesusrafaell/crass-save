/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import error from '@/images/payment/Error.png';
import success from '@/images/payment/Success.png';
import companyService from '@/services/company.service';
import { RootState } from '@/store';
import { refreshCompany } from '@/store/auth/authSlice';
import { capitalize } from '@mui/material';
import { Spinner } from '@nextui-org/react';
import { getCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
type TType = 'success' | 'error';

const TypeCredits: FC<any> = () => {
	const t = useTranslations('App');
	const t1 = useTranslations('App.SideBar');
	const t8 = useTranslations('credits.purchased');
	const pathname = usePathname();

	//refresh company
	const dispatch = useDispatch();
	const { user: userContent } = useSelector((state: RootState) => state.auth);
	const role = getCookie('role');
	const { push, refresh } = useRouter();

	const [type, settype] = useState<TType>();

	const animations = {
		success: {
			src: success,
			title: t8('success'),
			subtitle: t8('redirectGood'),
		},
		error: {
			src: error,
			title: t8('error'),
			subtitle: t8.rich('redirectError', {
				credits: capitalize(t1('credits')),
				purchase: capitalize(t1('purchase')),
			}),
		},
	};

	const handleSeparation = () => {
		const [, , , type] = pathname.split('/');
		settype(type === 'success' ? 'success' : 'error');
	};

	const handleRedirect = async () => {
		if (!type) return;
		if (type === 'success') {
			if (role === 'company' && userContent) {
				const { id } = userContent.info;
				const resCompany = await companyService.get(id);
				dispatch(refreshCompany(resCompany));
			}
			setTimeout(() => {
				push('/company');
				refresh();
			}, 2500);
		} else {
			setTimeout(() => {
				push('/credits/buy');
			}, 2500);
		}
	};

	useMemo(async () => await handleRedirect(), [type]);

	useLayoutEffect(() => {
		handleSeparation();
	}, []);

	if (!type) return <Spinner size='lg' color='default' label={`${capitalize(t('loading'))}...`} />;
	return (
		<div className='flex flex-col items-center justify-items-center p-8 gap-8'>
			<Image
				className='animate-[bounce_1.8s_ease-in-out_infinite]'
				// className='animate-[bounce_2s_ease-in-out_both]'
				src={animations[type].src}
				alt='type icon'
				width={150}
				height={150}
			/>
			<div className=' text-7xl text-center font-bold'>{animations[type].title}</div>
			<div className='lg:text-2xl text-xl text-foreground-500 text-center'>{animations[type].subtitle}</div>
			<Spinner size='lg' className='mt-16' color='default' label={`${capitalize(t('loading'))}...`} />
		</div>
	);
};

export default TypeCredits;
