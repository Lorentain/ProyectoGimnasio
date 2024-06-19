import { useState } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function BaseDatos() {
    const auth = getAuth();
    const [usuarioID,setUsuarioID] = useState(null);
    const db = getFirestore();

    // Escucha el cambio de estado de autenticación
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Usuario autenticado
            const uid = user.uid;
            setUsuarioID(uid);

            // Crea una colección de usuarios si no existe
            const usersCollectionRef = collection(db, 'users');

            // Verifica si el usuario ya tiene un documento
            const userDocRef = doc(usersCollectionRef, uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (!userDocSnapshot.exists()) {
                // Si el usuario no tiene un documento, crea uno con sus datos
                await setDoc(userDocRef, {
                    nombres: user.displayName,
                    email: user.email,
                    cuotaActiva: false,
                    fechaCaducidad: ''
                    // Otros datos del usuario si es necesario
                });
                console.log("Documento creado para el usuario:", user.displayName);
            } else {
                console.log("El documento ya existe para el usuario:", user.displayName);
            }
        } else {
            // Usuario no autenticado
            console.log("Usuario no autenticado");
        }
    });

    function formatearFecha(fecha) {
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const año = fecha.getFullYear();
        return `${dia}-${mes}-${año}`;
    }

    async function actualizarDatos() {
        if (usuarioID) {
            const userDocRef = doc(db, 'users', usuarioID);

            const today = new Date();
            const nuevaFechaCaducidad = new Date(today);
            nuevaFechaCaducidad.setDate(today.getDate() + 30);

            await updateDoc(userDocRef, {
                cuotaActiva: true,
                fechaCaducidad: formatearFecha(nuevaFechaCaducidad)
            });
            console.log("Datos actualizados para el usuario:", usuarioID);
        } else {
            console.log("No hay usuario autenticado.");
        }
    }

    return (
        <>
            <h1>Base de Datos</h1>
            <Link to="/">Ruta de Inicio</Link>
            <Link to="/prueba">Ruta de Prueba</Link>
            <Link to="/basedatos">Ruta de BaseDatos</Link>
            <button onClick={actualizarDatos}>Actualizar Datos</button>
        </>
    )
}

export default BaseDatos;
