import { FC } from 'react';

export type StatusTypeSpinner = 'success' | 'loading' | 'error';

interface Props {
	status: StatusTypeSpinner;
}

const SpinnerVerify: FC<Props> = ({ status = 'loading' }) => {
	const renderStatusIcon = () => {
		switch (status) {
			case 'success':
				return (
					<svg x='0px' y='0px' width='50px' height='50px' viewBox='0 0 32 32' fill='white'>
						<path d='M 28.28125 6.28125 L 11 23.5625 L 3.71875 16.28125 L 2.28125 17.71875 L 10.28125 25.71875 L 11 26.40625 L 11.71875 25.71875 L 29.71875 7.71875 Z'></path>
					</svg>
				);
			case 'error':
				return (
					<svg x='0px' y='0px' width='60px' height='60px' viewBox='0 0 50 50' fill='white'>
						<path d='M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z'></path>
					</svg>
				);
		}
	};
	return (
		<div
			className={`${status} 
                loader 
                h-[100px] w-[100px] 
                opacity-1 relative m-auto 
                transition-opacity duration-500 ease-in-out
            `}
		>
			<svg className='spinner' width='100px' height='100px' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'>
				<circle className='path' fill='none' strokeWidth='4' strokeLinecap='round' cx='22' cy='22' r='20'></circle>
			</svg>
			<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
				{renderStatusIcon()}
			</div>
		</div>
	);
};

export default SpinnerVerify;
