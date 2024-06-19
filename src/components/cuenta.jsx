import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Cuenta() {
    const [usuarioActivo, setUsuarioActivo] = useState(null); // Estado del usuario activo (nombre)
    const [usuarioCorreo, setUsuarioCorreo] = useState(null); // Estado del usuario activo (correo)
    const [cuotaActiva, setCuotaActiva] = useState(null); // Estado para almacenar la cuota activa
    const [fechaCaducidad, setFechaCaducidad] = useState(null); // Estado para almacenar la fecha caducidad (cuota)
    const [usuarioRol, setUsuarioRol] = useState(null); // Estado para almacenar el rol del usuario
    const [cuotaCaducada, setCuotaCaducada] = useState(false); // Estado para controlar si la cuota ha caducado
    const [mensaje, setMensaje] = useState(''); // Estado para mensajes
    const [tipoMensaje, setTipoMensaje] = useState(''); // Estado para el tipo de mensaje
    const db = getFirestore();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                const userDocRef = doc(db, 'users', uid);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setUsuarioActivo(userData.nombres);
                    setUsuarioCorreo(userData.email);
                    setCuotaActiva(userData.cuotaActiva); 
                    setFechaCaducidad(userData.fechaCaducidad);
                    setUsuarioRol(userData.rol);

                    // Verificar y comparar la fecha de caducidad si está definida
                    if (userData.cuotaActiva && userData.fechaCaducidad) {
                        const hoy = new Date();
                        const fechaCaducidadUsuario = parseFecha(userData.fechaCaducidad); // Convertir string a Date
                        if (fechaCaducidadUsuario < hoy) {
                            try {
                                // Si la fecha de caducidad es anterior a la actual, desactivar la cuota
                                await updateDoc(userDocRef, {
                                    cuotaActiva: false
                                });
                                setCuotaActiva(false);
                                setCuotaCaducada(true); // Activar estado de cuota caducada
                            } catch (error) {
                                console.error("Error al actualizar la cuota activa en Firestore:", error);
                                // Manejar el error según sea necesario
                            }
                        }
                    }

                } else {
                    console.log("No se encontró el documento del usuario en Firestore");
                    setUsuarioActivo(null);
                    setUsuarioCorreo(null);
                    setCuotaActiva(null); 
                    setFechaCaducidad(null);
                    setUsuarioRol(null);
                }
            } else {
                setUsuarioActivo(null);
                setUsuarioCorreo(null);
                setCuotaActiva(null); 
                setFechaCaducidad(null);
                setUsuarioRol(null);
            }
        });

        return () => unsubscribe();
    }, [db]);

    // Función para parsear fecha en formato dd-MM-YYYY a objeto Date
    function parseFecha(fechaString) {
        const partes = fechaString.split("-");
        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1; // Meses en JavaScript son de 0 a 11
        const anio = parseInt(partes[2], 10);
        return new Date(anio, mes, dia);
    }

    // Función para darse de baja
    const handleDarseDeBaja = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const uid = user.uid;
            const userDocRef = doc(db, 'users', uid);
            try {
                await updateDoc(userDocRef, {
                    cuotaActiva: false,
                    fechaCaducidad: ''
                });
                setCuotaActiva(false);
                setFechaCaducidad('');
                setMensaje('Su suscripción ha sido cancelada exitosamente.');
                setTipoMensaje('exito');
            } catch (error) {
                console.error("Error al actualizar la cuota activa en Firestore:", error);
                setMensaje('Error al cancelar la suscripción. Inténtelo de nuevo más tarde.');
                setTipoMensaje('error');
            }
        }
    };

    return (
        <>
            <section className="main-cuenta flex flex-col items-center">
                <h1 className="text-6xl font-bold text-center text-white mt-8 bg-purple-900 p-4 w-2/3 rounded-md">Mi Cuenta</h1>
                {usuarioActivo ? (
                    <>
                        <br/>
                        <p className="text-2xl text-center"><b>Nombre y Apellidos:</b> {usuarioActivo}</p>
                        <br/>
                        <p className="text-2xl text-center"><b>Email:</b> {usuarioCorreo}</p>
                        <br/>
                        <p className="text-2xl text-center"><b>Cuota Activa:</b> {cuotaActiva ? "Sí" : "No"}</p>
                        <br/>
                        <p className="text-2xl text-center"><b>Fecha Caducidad (Cuota):</b> {fechaCaducidad ? fechaCaducidad : "Ninguna"}</p>
                        <br/>
                        <p className="text-2xl text-center"><b>Rol:</b> {usuarioRol} {usuarioRol === 'admin' && <Link to="/adminuser"><span className="ml-2 bg-yellow-500 p-2 rounded text-black">Administrar usuarios</span></Link>}</p>
                        {cuotaActiva && (
                            <button 
                                onClick={handleDarseDeBaja}
                                className="bg-red-500 text-2xl text-white p-4 rounded-md mt-4">
                                Darse de baja
                            </button>
                        )}
                        {cuotaActiva === false && (
                            <>
                            <Link to="/cuotas">
                            <div className="bg-purple-500 p-6 rounded-md mt-4">
                                <p className="text-2xl text-white bg-red-700 font-bold p-2 mt-2 mb-2">Su cuota está inactiva</p>
                                <p className='text-2xl font-bold text-center bg-white p-2'>Ver cuotas</p>
                            </div>
                            </Link>
                            </>
                        )}
                    </>
                ) : (
                    <p>No hay usuario activo.</p>
                )}
            </section>
        </>
    );    
}

export default Cuenta;