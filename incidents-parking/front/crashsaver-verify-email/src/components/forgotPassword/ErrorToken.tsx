import { FC } from 'react';

interface Props {
	message: string;
}

const ErrorToken: FC<Props> = ({ message }) => {
	return (
		<div className='w-screen h-screen flex flex-col lg:flex-row justify-center items-center gap-20'>
			<div className='text-center lg:text-start'>
				<h1 className='text-5xl font-bold text-red-700'>Error</h1>
				<h2 className='text-2xl mt-5'>{message}</h2>
			</div>
			<img src='/crashsaver-logo.png' alt='logo' />
		</div>
	);
};

export default ErrorToken;
