import '../css/Servicios.css'

function servicios() {
    return (
        <>
            <main className="main-servicios flex flex-col items-center justify-center gap-8">
                <h1 className="text-7xl font-bold text-center mt-8"><span className="text-purple-400">N</span>uestros <span className="text-purple-400">S</span>ervicios</h1>
                <div className="contenedor__servicios flex items-center justify-center flex-wrap gap-12">

                    <div className="card-wave">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>

                        <div className="contenido flex flex-col gap-4">
                            <i className='bx bxs-bowl-rice text-7xl text-white'></i>
                            <h1 className="text-4xl font-bold text-white">Nutrición</h1>
                            <p className="text-lg text-center text-white">Información sobre nutrición para el gimnasio
                            </p>
                        </div>
                    </div>

                    <div className="card-wave">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>

                        <div className="contenido flex flex-col gap-4">
                            <i className='bx bxs-food-menu text-7xl text-white'></i>
                            <h1 className="text-4xl font-bold text-white">Dieta</h1>
                            <p className="text-lg text-center text-white">Las mejores dietas para deportistas
                            </p>
                        </div>
                    </div>

                    <div className="card-wave">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>

                        <div className="contenido flex flex-col gap-4">
                            <i className='bx bx-plus-medical text-7xl text-white'></i>
                            <h1 className="text-4xl font-bold text-white">Salud</h1>
                            <p className="text-lg text-center text-white">Trucos para manternerte saludable
                            </p>
                        </div>
                    </div>

                </div>
                <div className="contenedor__servicios flex items-center justify-center flex-wrap gap-12">

                    <div className="card-wave">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>

                        <div className="contenido flex flex-col gap-4">
                            <i className='bx bx-list-check text-7xl text-white'></i>
                            <h1 className="text-4xl font-bold text-white">Rutinas</h1>
                            <p className="text-lg text-center text-white">Las mejores rutinas de ejercicios
                            </p>
                        </div>
                    </div>

                    <div className="card-wave">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>

                        <div className="contenido flex flex-col gap-4">
                            <i className='bx bxs-building text-7xl text-white'></i>
                            <h1 className="text-4xl font-bold text-white">Gimnasio</h1>
                            <p className="text-lg text-center text-white">Un gimnasio equipado con todo lo necesario
                            </p>
                        </div>
                    </div>

                    <div className="card-wave">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>

                        <div className="contenido flex flex-col gap-4">
                            <i className='bx bx-dumbbell text-7xl text-white'></i>
                            <h1 className="text-4xl font-bold text-white">Instructores</h1>
                            <p className="text-lg text-center text-white">Nuestros intructores te ayudarán a mejorar
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </>
    )
}

export default servicios;