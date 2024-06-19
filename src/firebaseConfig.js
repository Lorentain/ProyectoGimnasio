import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCR3CIiB3iuj0ovTWCBh2Dh5rIfCCBc7q4",
    authDomain: "proyectogimnasio-47211.firebaseapp.com",
    projectId: "proyectogimnasio-47211",
    storageBucket: "proyectogimnasio-47211.appspot.com",
    messagingSenderId: "1025951254070",
    appId: "1:1025951254070:web:988399e79ea2802cc47a97",
    measurementId: "G-QY8CJ6LZ5J"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Obtener el objeto de autenticación
const auth = getAuth(app);
const db = getFirestore(app);

// Crear un proveedor de autenticación de Google
const provider = new GoogleAuthProvider();

export { auth, provider, db };
