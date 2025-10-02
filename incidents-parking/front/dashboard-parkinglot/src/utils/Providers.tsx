'use client';

import { persistor, store } from '@/store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

export default function Providers({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						// staleTime: 60 * 1000,
					},
				},
			}),
	);
	return (
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<PersistGate persistor={persistor}>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<NextUIProvider>{children}</NextUIProvider>
					</LocalizationProvider>
				</PersistGate>
			</Provider>
		</QueryClientProvider>
	);
}
