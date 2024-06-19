import empresaIMG from '../../public/empresa.png'

function empresa() {
    return (
        <>
            <main className="main-empresa flex flex-col items-center justify-center gap-12">
                <h1 className="text-7xl font-bold text-center mt-6">¿Que es Gym Purple?</h1>
                <div className="contenedor__empresa flex items-center justify-center gap-12 p-12">
                    <div className="text-2xl text-center w-2/4">En <b>Gym Purple</b>, nos dedicamos a transformar tu estilo de vida mediante un enfoque
                        integral en el fitness y el bienestar. Ubicados en el corazón de la ciudad, somos más que un simple gimnasio: somos
                        una comunidad comprometida con el desarrollo físico, mental y emocional de nuestros miembros.
                        <br></br><br></br>
                        Te invitamos a visitar nuestras instalaciones y descubrir todo lo que Gym Purple tiene para ofrecer. Ofrecemos
                        pases de prueba gratuitos y opciones de membresía flexibles para adaptarnos a tus necesidades. No esperes más
                        para empezar tu camino hacia una vida más saludable y activa.
                    </div>
                    <div className="empresa__img w-2/4 border-solid border-black border-2">
                        <img className="w-full h-full" src={empresaIMG} />
                    </div>
                </div>
            </main>
        </>
    )
}

export default empresa;