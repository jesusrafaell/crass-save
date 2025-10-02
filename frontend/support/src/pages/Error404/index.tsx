function Error404() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-opacity-20">
      <div className="text-start flex flex-col gap-y-10">
        <h2 className="text-4xl md:text-5xl font-bold">Uppsss... 404</h2>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold capitalize">
            Página no encontrada
          </h2>
          <p className="text-xl text-gray-400">Esta página no existe</p>
        </div>
      </div>
    </div>
  );
}

export default Error404;
