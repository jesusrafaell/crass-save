import logo from '@/images/crash-saver-app-logo.png';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import Link from 'next/link';
import { VscThreeBars } from 'react-icons/vsc';

const Header = (props: { sidebarOpen: string | boolean | undefined; setSidebarOpen: (arg0: boolean) => void }) => {
	const role = getCookie('role');
	return (
		<header className='sticky top-0 z-999 flex w-full bg-black drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none'>
			<div className='flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11'>
				<div className='flex items-center gap-2 sm:gap-4 lg:hidden'>
					{/* <!-- Hamburger Toggle BTN --> */}
					<button
						aria-controls='sidebar'
						onClick={(e) => {
							e.stopPropagation();
							props.setSidebarOpen(!props.sidebarOpen);
						}}
						className='z-99999 block rounded-sm bg-black p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden'>
						<span className='relative block h-6 w-6 cursor-pointer'>
							<VscThreeBars className='bg-black fill-white w-full h-full' />
						</span>
					</button>
					{/* <!-- Hamburger Toggle BTN --> */}

					<Link className='block flex-shrink-0 lg:hidden' href={`/${role ? role : ''}`}>
						<Image width={50} height={32} src={logo} alt='Logo' />
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
