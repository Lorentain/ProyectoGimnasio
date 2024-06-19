import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import '../css/Cuotas.css';
import iconPaypal from '../../public/paypal.png'
import iconVisa from '../../public/visa.png'

function Cuotas() {
    const [pagoRealizado, setPagoRealizado] = useState(null);
    const [usuarioActivo, setUsuarioActivo] = useState(null);
    const db = getFirestore();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUsuarioActivo(user);
            } else {
                setUsuarioActivo(null);
            }
        });
        return () => unsubscribe();
    }, []);

    function pago(titulo, precio) {
        console.log("Haciendo pago");
        const pagoJSX = (
            <div className="capa__fondo">
                <div className="contenedor__pago">
                    <h1><b>Realizar Pago</b></h1>
                    <h2><b>Cuota:</b> {titulo}</h2>
                    <p><b>Precio:</b> {precio}</p>
                    <div className="metodo__pago">
                        <img className='cursor-pointer' src={iconPaypal} onClick={() => realizarPago(titulo, precio)} />
                        <img className='cursor-pointer' src={iconVisa} onClick={() => realizarPago(titulo, precio)} />
                    </div>
                    <button onClick={cancelarPago}>Cancelar</button>
                </div>
            </div>
        );
        setPagoRealizado(pagoJSX);
    }

    function formatearFecha(fecha) {
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
        const año = fecha.getFullYear();
        return `${dia}-${mes}-${año}`;
    }

    async function realizarPago(titulo) {
        if (!usuarioActivo) {
            setPagoRealizado(
                <div className="capa__fondo">
                    <div className="contenedor__pago">
                        <h2 className='bg-red-400 negro p-2 font-bold text-center rounded-md'>
                            <Link to="/login">Necesitas loguearte <br></br> Ir al login </Link>
                        </h2>
                        <button onClick={cancelarPago}>Cerrar</button>
                    </div>
                </div>
            );
            return;
        }

        const userDocRef = doc(db, 'users', usuarioActivo.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            if (userData.cuotaActiva) {
                setPagoRealizado(
                    <div className="capa__fondo">
                        <div className="contenedor__pago">
                            <h2 className='bg-yellow-400 negro p-2 font-bold text-center rounded-md'>Ya tienes una suscripción activa</h2>
                            <button onClick={cancelarPago}>Cerrar</button>
                        </div>
                    </div>
                );
            } else {
                const today = new Date();
                const nuevaFechaCaducidad = new Date(today);
                
                if (titulo === "Cuota Trimestral") {
                    // Cuota Trimestral: 3 meses de inscripción
                    nuevaFechaCaducidad.setMonth(today.getMonth() + 3);
                } else {
                    // Otras cuotas: 1 mes de inscripción
                    nuevaFechaCaducidad.setDate(today.getDate() + 30);
                }

                await updateDoc(userDocRef, { 
                    cuotaActiva: true,
                    fechaCaducidad: formatearFecha(nuevaFechaCaducidad)
                });
                setPagoRealizado(
                    <div className="capa__fondo">
                        <div className="contenedor__pago">
                            <h2 className='verde-fosforito negro p-2 font-bold text-center rounded-md '>Pago Realizado Correctamente</h2>
                            <button onClick={cancelarPago}>Cerrar</button>
                        </div>
                    </div>
                );
            }
        } else {
            setPagoRealizado(
                <div className="capa__fondo">
                    <div className="contenedor__pago">
                        <h2 className='bg-red-400 p-2 font-bold text-center rounded-md'>No estas logueado</h2>
                        <button onClick={cancelarPago}>Cerrar</button>
                    </div>
                </div>
            );
        }
    }

    function cancelarPago() {
        setPagoRealizado(null);
    }

    return (
        <>
            <main className="main-inscribete flex flex-col items-center justify-center">
                <h1 className="text-6xl font-bold text-center text-white w-4/5 bg-purple-900 p-4 rounded-md mt-6">Precios de Cuotas</h1>
                <p className="text-center text-lg mt-4 p-2">A continuación todos los precios de las cuotas existentes. Adicional existe otra cuota de 5€ para un día (no disponible online).
                    <br />*Todos los precios vienen incluidos con IVA
                </p>
                <div className="contenedor__cuotas flex justify-center items-center flex-wrap gap-12 mt-12 mb-10">
                    <div className="cuota flex flex-col justify-around items-center">
                        <h1 className="text-4xl font-bold">Cuota <br />Trimestral</h1>
                        <div className="cinta">Mejor Precio</div>
                        <h1 className="text-4xl font-bold">80€</h1>
                        <p className="text-2xl">3 meses de inscripción</p>
                        <p className="text-2xl">Ahórrate 25€</p>
                        <button className="btn-pagar" onClick={() => pago("Cuota Trimestral", "80€")}>Pagar</button>
                    </div>

                    <div className="cuota flex flex-col justify-around items-center">
                        <h1 className="text-4xl font-bold">Cuota <br />Individual</h1>
                        <div className="cinta">Estandar</div>
                        <h1 className="text-4xl font-bold">35€</h1>
                        <p className="text-2xl">1 mes de inscripción</p>
                        <p className="text-2xl">Opción estándar</p>
                        <button className="btn-pagar" onClick={() => pago("Cuota Individual", "35€")}>Pagar</button>
                    </div>

                    <div className="cuota flex flex-col justify-around items-center">
                        <h1 className="text-4xl font-bold">Cuota <br />Joven</h1>
                        <div className="cinta">Para Jóvenes</div>
                        <h1 className="text-4xl font-bold">30€</h1>
                        <p className="text-2xl">1 mes de inscripción</p>
                        <p className="text-2xl">Ahórrate 5€</p>
                        <button className="btn-pagar" onClick={() => pago("Cuota Joven", "30€")}>Pagar</button>
                    </div>

                    <div className="cuota flex flex-col justify-around items-center">
                        <h1 className="text-4xl font-bold">Cuota <br />Jubilado/a</h1>
                        <div className="cinta">Para jubilados</div>
                        <h1 className="text-4xl font-bold">25€</h1>
                        <p className="text-2xl">1 mes de inscripción</p>
                        <p className="text-2xl">Ahórrate 10€</p>
                        <button className="btn-pagar" onClick={() => pago("Cuota Jubilado", "25€")}>Pagar</button>
                    </div>
                </div>

                {pagoRealizado && (
                    <div className="resultado-pago">
                        {pagoRealizado}
                    </div>
                )}
            </main>
        </>
    );
}

export default Cuotas;