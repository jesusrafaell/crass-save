import { useLayoutEffect, useRef, useState } from 'react';
import SpinnerVerify, { StatusTypeSpinner } from '../../components/SpinnerVerify';
import { msgErrorToken } from '../../errors';

function VerifyTruck() {
	const [message, setMessage] = useState('');
	const hasRun = useRef(false);
	const [status, setStatus] = useState<StatusTypeSpinner>('loading');

	useLayoutEffect(() => {
		if (!hasRun.current) {
			const verifyEmail = async () => {
				try {
					setStatus('loading');

					// const currentUrl = window.location.href;
					const queryString = window.location.search;
					const urlParams = new URLSearchParams(queryString);
					// Obtener el valor del parámetro 'token'
					const token = urlParams.get('token');
					console.log('token new', token);

					if (token) {
						const response = await fetch(
							`${import.meta.env.VITE_URL_API}/v1/api/users/verify-token/verify-truck`,
							{
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({ token }),
							},
						);

						// if (true) {
						if (response.ok) {
							//recibir corrreo
							const data: { message: string; email: string; ok: boolean } = await response.json();
							setStatus('success');
							setMessage(data.email || 'Listo');
						} else {
							const errorResponse: { error: string; name?: string } = await response.json();
							throw new Error(errorResponse.error);
						}
					}
				} catch (error) {
					// console.log(error);
					setMessage(msgErrorToken.R017E);
					setStatus('error');
				}
			};

			verifyEmail();
			hasRun.current = true; // Marcar que el useEffect ha corrido
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Dependencias vacías para que se ejecute solo una vez

	const messageText = {
		loading: 'Verificando...',
		success: 'Verificado',
		error: 'Error',
	};

	return (
		<div className='flex flex-col w-screen h-screen justify-center items-center'>
			<div className='mx-5 w-[350px] lg:w-[400px] overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-xl py-10 px-20 items-center flex flex-col'>
				<img src='/crashsaver-logo.png' alt='logo' className='mb-4 w-[128px]' />
				<SpinnerVerify status={status} />
				<h1 className='mt-2 text-center text-2xl font-bold text-gray-500'>{messageText[status]}</h1>
				<p className='my-4 text-center text-md text-gray-500'>{message}</p>
			</div>
			<div className='w-[150px] mt-5'></div>
		</div>
	);
}

export default VerifyTruck;
