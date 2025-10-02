import { useState, useEffect, FC } from 'react';

interface Props {
	onSubmit: (password: string, confirmPassword: string) => Promise<void>;
	load: boolean;
}

const PasswordForm: FC<Props> = ({ onSubmit, load }) => {
	const [ready, setReady] = useState(false);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errorPassword, setErrorPassword] = useState(false);
	const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		// Validar la contraseña cuando cambie
		if (password.length > 0) {
			const hasLetter = /[A-Za-z]/.test(password);
			const hasNumber = /\d/.test(password);
			const isLengthValid = password.length >= 8 && password.length <= 20;
			if (!(hasLetter && hasNumber && isLengthValid)) {
				setErrorPassword(true);
			} else {
				setErrorPassword(false);
			}

			setReady(!errorPassword && password === confirmPassword);
		}
		if (confirmPassword.length > 0) {
			if (confirmPassword !== password) {
				setErrorConfirmPassword(true);
			} else {
				setErrorConfirmPassword(false);
			}
		}
	}, [password, confirmPassword, errorPassword]);

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value);
	};

	const handleClick = async () => {
		try {
			if (!errorPassword && password === confirmPassword && password.length > 0 && confirmPassword.length > 0) {
				await onSubmit(password, confirmPassword);
			}
		} catch (error) {
			// console.log('error');
			setError('Server error');
		}
	};

	return (
		<form className='px-4 lg:px-10 py-7' autoComplete='off'>
			<div className='w-full text-center'>
				<h1 className='font-bold mb-7 text-2xl'>Cambio de contraseña</h1>
			</div>
			<div className='mb-1'>
				<label className='font-semibold text-sm text-gray-600 pb-1 block'>Nueva Contraseña</label>
				<input
					type='password'
					autoComplete='off'
					className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full 
													${errorPassword ? 'border-red-600' : 'border-gray-200'}
												`}
					placeholder='*********'
					name='password'
					value={password}
					onChange={handlePasswordChange}
				/>
				<div className={`flex relative text-red-600 pt-1 ${errorPassword ? ' opacity-100' : 'opacity-0'}`}>
					<p className='text-[11px] text-start max-w-[300px]'>
						La contraseña debe tener entre 8 y 20 caracteres, incluir al menos un número y al menos una letra.
					</p>
				</div>
			</div>
			<div className='mb-5'>
				<label className='font-semibold text-sm text-gray-600 pb-1 block'>Confirmar Contraseña</label>
				<input
					type='password'
					autoComplete='off'
					className={`border rounded-lg px-3 py-2 mt-1 text-sm w-full 
													${errorConfirmPassword ? 'border-red-600' : 'border-gray-200'}
												`}
					placeholder='*********'
					name='repeatPassword'
					value={confirmPassword}
					onChange={handleConfirmPasswordChange}
				/>
				<span
					className={`text-red-600 relative flex justify-end w-full pt-1 ${
						errorConfirmPassword ? 'opacity-100' : 'opacity-0'
					}`}
				>
					<p className='text-[11px]'>Las contraseñas no coinciden</p>
				</span>
			</div>
			<button
				type='button'
				disabled={!ready || load}
				onClick={handleClick}
				className={`
                                    transition duration-200 
                                    flex justify-center items-center
                                    w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md 
                                    font-semibold text-center text-white
                                    ${
																			ready && !load
																				? `bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50`
																				: 'bg-gray-400'
																		} `}
			>
				{load ? (
					<div className='h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4'></div>
				) : (
					<span>
						<span className='inline-block mr-2'>Enviar</span>

						<svg fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-4 h-4 inline-block'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 8l4 4m0 0l-4 4m4-4H3' />
						</svg>
					</span>
				)}
			</button>
			<span
				className={`text-red-600 relative flex h-[20px] w-full py-1 justify-center items-center mt-5 ${
					error.length ? 'opacity-100' : 'opacity-0'
				}`}
			>
				<p className='text-[14px]'>{error}, intenta mas tarde</p>
			</span>
		</form>
	);
};

export default PasswordForm;
