'use client';
import { capitalize } from '@mui/material';
import { Accordion, AccordionItem } from '@nextui-org/react';
import { getCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { FaArrowCircleDown, FaArrowCircleRight, FaQuestionCircle } from 'react-icons/fa';
interface IFAQList {
	company: IQuest[];
	parking: IQuest[];
}
interface IQuest {
	title: string;
	children: JSX.Element;
}
const accourdionTitle = 'text-xl text-justify';
const olStyle = 'p-2 list-decimal list-inside marker:text-primary-400 marker:font-bold text-justify';
const FAQ: FC = () => {
	const role = getCookie('role');
	const t = useTranslations('App');
	const t1 = useTranslations('App.SideBar');
	const t2 = useTranslations('App.Modals');
	const t3 = useTranslations('credits.buy');
	const t5 = useTranslations('createBooking');
	const t6 = useTranslations('faq');
	const t7 = useTranslations('faq.parking');
	const questionsCompany: IQuest[] = [
		{
			title: t6('q1.title'),
			children: (
				<>
					<p className={accourdionTitle}>{t6('q1.subtitle')}</p>
					<ol className={olStyle}>
						<li>{t6('q1.p1')}</li>
						<li>{t6('q1.p3')}</li>
						<li>{t6('q1.p4')}</li>
						<li>{t6('q1.p5')}</li>
						<li>{t6('q1.p7')}</li>
						<li>{t6.rich('q1.p8', { text: capitalize(t5('create')) })}</li>
					</ol>
				</>
			),
		},
		{
			title: t6('q2.title'),
			children: (
				<>
					<p className={accourdionTitle}>{t6('q2.subtitle')}</p>
					<ol className={olStyle}>
						<li>{t6('q2.p1')}</li>
						<li>{t6.rich('q2.p2', { text: capitalize(t3('checkout')) })}</li>
						<li>{t6('q2.p3')}</li>
						<li>{t6.rich('q2.p4', { text: capitalize(t2('pay')) })}</li>
					</ol>
				</>
			),
		},
	];
	const questionsParking: IQuest[] = [
		{
			title: t7('q1.title'),
			children: (
				<>
					<p className={accourdionTitle}>{t6('q1.subtitle')}</p>
					<ol className={olStyle}>
						<li>{t7.rich('q1.p1', { booking: capitalize(t1('booking')), all: capitalize(t1('all')) })}</li>
					</ol>
					<p>{t7.rich('q1.p2', { edit: capitalize(t('edit')), all: capitalize(t('delete')) })}</p>
				</>
			),
		},
	];
	const FAQList: IFAQList = {
		company: questionsCompany,
		parking: questionsParking,
	};

	return (
		<div className='flex flex-col place-items-center gap-2'>
			<h1 className='text-5xl'>{t6('title')}</h1>
			<h4 className='text-2xl text-foreground-400'>{t6('subtitle')}</h4>
			<Accordion
				variant='splitted'
				selectionMode='multiple'
				className='max-w-2xl mt-8 gap-6'
				itemClasses={{
					title: 'text-center text-2xl font-bold',
				}}>
				{FAQList[`${role}` as keyof IFAQList].map((quest, i) => (
					<AccordionItem
						className='text-foreground-500'
						key={i}
						startContent={<FaQuestionCircle className='w-6 h-6 fill-primary-400 ' />}
						title={quest.title}
						indicator={({ isOpen }) => (isOpen ? <FaArrowCircleRight /> : <FaArrowCircleDown />)}>
						{quest.children}
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
};

export default FAQ;
