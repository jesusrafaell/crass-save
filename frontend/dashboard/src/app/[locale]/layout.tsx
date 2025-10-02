import { NextIntlClientProvider, useMessages } from 'next-intl';
import React from 'react';

import Providers from '@/utils/Providers';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ContentLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	const messages = useMessages();
	const configToast: ToastContainerProps = {
		autoClose: 2500,
		theme: 'colored',
	};

	return (
		<NextIntlClientProvider messages={messages}>
			<Providers params={{ locale }}>
				<main className='flex-grow'>
					<div className='flex flex-col h-full'>{children}</div>
				</main>
				<ToastContainer {...configToast} />
			</Providers>
		</NextIntlClientProvider>
	);
}
