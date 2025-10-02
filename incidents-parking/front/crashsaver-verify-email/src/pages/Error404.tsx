function Error404() {
	return (
		<div className='min-h-screen flex justify-center items-center bg-opacity-20'>
			<div className='text-start flex flex-col gap-y-10'>
				<h2 className='text-4xl md:text-5xl font-bold'>Uppsss... 404</h2>
				<h2 className='text-2xl md:text-3xl font-bold capitalize'>page not found</h2>
				<p className='text-xl text-gray-400'>Bienvenido, esta pagina no existe</p>
			</div>
		</div>
	);
}

export default Error404;
