import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import '../css/Registro.css';

function Registro() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function registrarUsuario(e) {
        e.preventDefault();

        const auth = getAuth();
        const db = getFirestore();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Usuario registrado:', user);

            if (user) {
                const uid = user.uid;

                const usersCollectionRef = collection(db, 'users');

                const userDocRef = doc(usersCollectionRef, uid);
                const userDocSnapshot = await getDoc(userDocRef);

                if (!userDocSnapshot.exists()) {
                    await setDoc(userDocRef, {
                        nombres: nombre,
                        email: user.email,
                        cuotaActiva: false,
                        fechaCaducidad: '',
                        rol: 'usuario'
                    });
                    console.log("Documento creado para el usuario:", nombre);
                } else {
                    console.log("El documento ya existe para el usuario:", nombre);
                }
                navigate("/cuenta");
            } else {
                console.log("Usuario no autenticado");
            }
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error al registrar usuario:', errorCode, errorMessage);
        }
    }

    return (
        <>
            <section className='main-registro flex justify-center items-center flex-col'>
                <form className='form__registro flex flex-col justify-center items-center gap-8 bg-purple-900' onSubmit={registrarUsuario}>
                    <h1 className='text-5xl text-white font-bold text-center'>Registro</h1>
                    <div className="flex items-center justify-center gap-2 w-11/12">
                    <i className="fa-solid fa-user text-2xl text-white"></i>
                    <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        placeholder="Nombre y apellidos"
                        value={nombre}
                        required
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    </div>
                    <div className="flex items-center justify-center gap-2 w-11/12">
                    <i className="fa-solid fa-envelope text-2xl text-white"></i>
                    <input
                        className='bg-white'
                        type="email"
                        name="correo"
                        id="correo"
                        placeholder='Correo'
                        value={email}
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                        title="Por favor, ingrese un correo electrónico válido"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div className="flex items-center justify-center gap-2 w-11/12">
                    <i className="fa-solid fa-key text-2xl text-white"></i>
                    <input
                        className='bg-white'
                        type="password"
                        name="contraseña"
                        id="contraseña"
                        placeholder='Contraseña'
                        value={password}
                        pattern=".{8,}"
                        title='Mínimo 8 carácteres necesarios'
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>
                    <input className='bg-purple-300 text-white font-bold' type="submit" value="Registrarte" />
                </form>
            </section>
        </>
    );
}

export default Registro;