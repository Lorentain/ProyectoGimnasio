import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";
import '../css/Login.css';
import '../firebaseConfig.js';
// Importar imágen
import googleIMG from '../../public/google.png';

const provider = new GoogleAuthProvider();

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Usuario autenticado
                const uid = user.uid;

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
                        fechaCaducidad: '',
                        rol: 'usuario'
                        // Otros datos del usuario si es necesario
                    });
                    console.log("Documento creado para el usuario:", user.displayName);
                } else {
                    console.log("El documento ya existe para el usuario:", user.displayName);
                }
                navigate("/cuenta");
            } else {
                // Usuario no autenticado
                console.log("Usuario no autenticado");
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    function loginGoogle() {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log("Login correcto" + user);
                console.log(user.uid);
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData ? error.customData.email : null;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                setErrorMessage("Contraseña o correo erróneo");
                setShowErrorModal(true);
                // ...
            });
    }

    function loginUsuario(e) {
        e.preventDefault(); // Prevenir la recarga de la página al enviar el formulario
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log('Usuario logueado:', user);
                navigate("/cuenta");
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error al iniciar sesión:', errorCode, errorMessage);
                setErrorMessage("Contraseña o correo erróneo");
                setShowErrorModal(true);
            });
    }

    return (
        <>
            <section className='main-login flex justify-center items-center flex-col'>
                <form className='form__login flex flex-col justify-center items-center gap-8 bg-purple-900' onSubmit={loginUsuario}>
                    <h1 className='text-5xl text-white font-bold text-center'>Login</h1>
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
                    <input className='btn-loguearte bg-purple-300 text-white font-bold cursor-pointer' type="submit" value="Loguearte" />
                    <p className='text-white font-bold -m-4'>O</p>
                    <div className='google-login-button flex items-center justify-center bg-white p-2 rounded-md cursor-pointer' onClick={loginGoogle}>
                        <img className='google-logo w-6 h-6 mr-2' src={googleIMG} alt="Login with Google" />
                        <span className='text-black font-bold text-xl'>Iniciar sesión con Google</span>
                    </div>
                    <p className='text-lg text-white font-bold'><Link to="/registro">¿No tienes cuenta?</Link></p>
                </form>
            </section>

            {showErrorModal && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white p-8 rounded-md text-center'>
                        <h2 className='text-2xl font-bold mb-4'>Error en el inicio de sesión</h2>
                        <p className='mb-4'>{errorMessage}</p>
                        <button
                            className='bg-red-500 text-white p-2 rounded-md'
                            onClick={() => setShowErrorModal(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Login;