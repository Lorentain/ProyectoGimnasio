import '../css/Inicio.css';
import '../css/Mediaqueries.css';
import { Link } from 'react-router-dom';

// Importar imágenes
import gimnasio1 from '../../public/gimnasio1.jpg'
import gimnasio2 from '../../public/gimnasio2.jpg'
import dieta from '../../public/dieta.jpg'
import dieta2 from '../../public/dieta2.jpg'
import dieta3 from '../../public/dieta3.jpg'

function inicio() {
    return (
        <>
            <main className="main-hero relative">
                <div className="contenedor-parrafo absolute flex flex-col items-center justify-center">
                    <h1 className="text-8xl font-bold text-white text-center">GYM PURPLE</h1>
                    <p className="text-5xl text-white text-center mt-2">¡Apúntate ahora por solo 30€ al mes!</p>
                    <br></br>
                    <button className="btn_apuntate"><span><Link to="/cuotas">Apúntate</Link></span></button>
                </div>
            </main>

            <section className="incripcion flex flex-col items-center gap-12 p-10">
                <h1 className="inscripcion__titulo text-6xl text-center font-bold bg-purple-900 text-white w-10/12 rounded-md p-6">Inscríbete en nuestro Gimnasio</h1>
                <p className="text-2xl max-w-4xl">Gym Purple cuenta con unas buenas instalaciones de máquinas para hacer ejercicio, ya sea cardio,
                    musculación, calistenia, boxeo... Mantenemos nuestras instalaciones lo más cuidadas posible y limpias, para que hacer ejercicio
                    sea mucho más cómodo. Nuestras máquinas son todas de últimas generaciones ofreciendo las mejores prestaciones del mercado.
                    <br></br><br></br>
                    Ofrecemos una variedad de diferentes cuotas: cuota estándar, cuota joven, cuota jubilado y cuota trimestral. Estas cuotas se adaptan
                    a las necesidades de nuestros clientes y algunas tienen un precio reducido.
                </p>
                <div className="contenedor__instalaciones flex justify-center items-center flex-wrap gap-14">
                    <div className="instalaciones__img"><img src={gimnasio1}/></div>
                    <div className="instalaciones__img"><img src={gimnasio2}/></div>
                </div>
                <button className="btn-primary-dark"><Link to="/cuotas">Inscríbete ahora</Link></button>
            </section>

            <section className="blog flex flex-col items-center bg-purple-900 gap-12 p-12">
                <h1 className="text-6xl font-bold text-center text-white">¿Quieres informarte sobre nutrición?</h1>
                <p className="text-2xl max-w-6xl text-white">En nuestro blog puedes encontrar información sobre nutrición respecto al deporte
                    y también podrás encontrar varios tipos de dietas. Toda esta información es gratuita para cualquier persona,
                    si quieres acceder a información más experta tienes que estar inscrito.
                </p>
                <div className="blog__informacion flex items-center justify-center flex-wrap gap-32">
                    <div className="cards__nutricion"><img className="dieta__img border-2 border-white" src={dieta}/></div>
                    <div className="cards__nutricion"><img className="dieta__img border-2 border-white" src={dieta2}/></div>
                    <div className="cards__nutricion"><img className="dieta__img border-2 border-white" src={dieta3}/></div>
                </div>
                <button className="btn-primary"><Link to="/blog">Más información</Link></button>
            </section>
        </>
    )
}

export default inicio;