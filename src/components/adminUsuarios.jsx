import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    /* Comprobar si el usuario es Admin para acceder a esta ruta */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.rol === 'admin') {
                        setUserRole('admin');
                    } else {
                        navigate('/');
                    }
                } else {
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);


    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);

                if (usersSnapshot.empty) {
                    console.log('No se encontraron documentos.');
                    return;
                }

                const usuariosData = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsuarios(usuariosData);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        };

        fetchUsuarios();
    }, []);

    const handleActualizarCuotaActiva = async (userId, cuotaActivaActual, fechaCaducidadActual) => {
        const userRef = doc(db, 'users', userId);

        try {
            let nuevaCuotaActiva = !cuotaActivaActual; // Invertir el valor de cuotaActiva
            let nuevaFechaCaducidad = fechaCaducidadActual;

            if (nuevaCuotaActiva) {
                // Si se cambia a cuotaActiva true y fechaCaducidad está vacía, establecer la fecha actual
                if (!fechaCaducidadActual) {
                    const fechaHoy = new Date();
                    const fechaCaducidad = new Date(fechaHoy.setDate(fechaHoy.getDate() + 30)); // Sumar 30 días a la fecha actual
                    const dia = fechaCaducidad.getDate().toString().padStart(2, '0');
                    const mes = (fechaCaducidad.getMonth() + 1).toString().padStart(2, '0');
                    const anio = fechaCaducidad.getFullYear().toString();
                    nuevaFechaCaducidad = `${dia}-${mes}-${anio}`;
                }
            } else {
                // Si se cambia a cuotaActiva false, establecer fechaCaducidad como vacía
                nuevaFechaCaducidad = '';
            }

            await updateDoc(userRef, {
                cuotaActiva: nuevaCuotaActiva,
                fechaCaducidad: nuevaFechaCaducidad
            });
            console.log(`Se actualizó cuotaActiva para el usuario con ID ${userId} a ${nuevaCuotaActiva} y fecha de caducidad a ${nuevaFechaCaducidad}`);

            // Actualizar la lista de usuarios después de la actualización
            const updatedUsuarios = usuarios.map(usuario => {
                if (usuario.id === userId) {
                    return { ...usuario, cuotaActiva: nuevaCuotaActiva, fechaCaducidad: nuevaFechaCaducidad };
                }
                return usuario;
            });
            setUsuarios(updatedUsuarios);

        } catch (error) {
            console.error('Error al actualizar cuotaActiva:', error);
        }
    };

    const handleActualizarCuotaActivaTrimestral = async (userId, cuotaActivaActual, fechaCaducidadActual) => {
        const userRef = doc(db, 'users', userId);

        try {
            let nuevaCuotaActiva = !cuotaActivaActual; // Invertir el valor de cuotaActiva
            let nuevaFechaCaducidad = fechaCaducidadActual;

            if (nuevaCuotaActiva) {
                const fechaHoy = new Date();
                let fechaCaducidad = new Date(fechaHoy);
                fechaCaducidad.setMonth(fechaCaducidad.getMonth() + 3); // Sumar 3 meses a la fecha actual

                const dia = fechaCaducidad.getDate().toString().padStart(2, '0');
                const mes = (fechaCaducidad.getMonth() + 1).toString().padStart(2, '0'); // getMonth() devuelve un valor de 0 a 11
                const anio = fechaCaducidad.getFullYear().toString();
                nuevaFechaCaducidad = `${dia}-${mes}-${anio}`;
            } else {
                // Si se cambia a cuotaActiva false, establecer fechaCaducidad como vacía
                nuevaFechaCaducidad = '';
            }

            await updateDoc(userRef, {
                cuotaActiva: nuevaCuotaActiva,
                fechaCaducidad: nuevaFechaCaducidad
            });
            console.log(`Se actualizó cuotaActiva para el usuario con ID ${userId} a ${nuevaCuotaActiva} y fecha de caducidad a ${nuevaFechaCaducidad}`);

            // Actualizar la lista de usuarios después de la actualización
            const updatedUsuarios = usuarios.map(usuario => {
                if (usuario.id === userId) {
                    return { ...usuario, cuotaActiva: nuevaCuotaActiva, fechaCaducidad: nuevaFechaCaducidad };
                }
                return usuario;
            });
            setUsuarios(updatedUsuarios);

        } catch (error) {
            console.error('Error al actualizar cuotaActiva:', error);
        }
    };

    const handleActualizarRol = async (userId, nuevoRol) => {
        const userRef = doc(db, 'users', userId);

        try {
            await updateDoc(userRef, {
                rol: nuevoRol
            });
            console.log(`Se actualizó el rol del usuario con ID ${userId} a ${nuevoRol}`);

            // Actualizar la lista de usuarios después de la actualización
            const updatedUsuarios = usuarios.map(usuario => {
                if (usuario.id === userId) {
                    return { ...usuario, rol: nuevoRol };
                }
                return usuario;
            });
            setUsuarios(updatedUsuarios);

        } catch (error) {
            console.error('Error al actualizar el rol:', error);
        }
    };

    return (
        <div className="admin-usuarios flex flex-col items-center bg-gray-100 min-h-screen p-6">
            <h1 className='text-6xl font-bold text-center mt-6 mb-6 text-black'>Usuarios Registrados</h1>
            <ul className="w-full max-w-4xl">
                {usuarios.map((usuario, index) => (
                    <li className='bg-white shadow-md rounded-lg p-6 mb-6' key={index}>
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex-1">
                                <p className='text-lg'><strong>Nombre:</strong> {usuario.nombres}</p>
                                <p className='text-lg'><strong>Email:</strong> {usuario.email}</p>
                                <p className='text-lg'><strong>Cuota Activa:</strong> {usuario.cuotaActiva ? 'Sí' : 'No'}</p>
                                <p className='text-lg'><strong>Fecha Caducidad:</strong> {usuario.fechaCaducidad || ''}</p>
                                <div className="flex items-center mt-2">
                                    <p className='text-lg mr-2'><strong>Rol:</strong></p>
                                    <select
                                        value={usuario.rol}
                                        onChange={(e) => handleActualizarRol(usuario.id, e.target.value)}
                                        className="p-1 text-black font-bold border-2 border-black"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="usuario">Usuario</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button className='bg-purple-500 text-white font-bold p-2 rounded-md mt-4 md:mt-0 md:ml-4' onClick={() => handleActualizarCuotaActiva(usuario.id, usuario.cuotaActiva, usuario.fechaCaducidad)}>
                                    Cambiar Cuota Activa
                                </button>
                                <button className='bg-purple-500 text-white font-bold p-2 rounded-md mt-4 md:mt-0 md:ml-4' onClick={() => handleActualizarCuotaActivaTrimestral(usuario.id, usuario.cuotaActiva, usuario.fechaCaducidad)}>
                                    Cambiar Cuota Activa (Trimestral)
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminUsuarios;