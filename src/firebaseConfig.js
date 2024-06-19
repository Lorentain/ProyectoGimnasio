import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "NO VISIBLE",
    authDomain: "NO VISIBLE",
    projectId: "NO VISIBLE",
    storageBucket: "NO VISIBLE",
    messagingSenderId: "NO VISIBLE",
    appId: "NO VISIBLE",
    measurementId: "NO VISIBLE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Obtener el objeto de autenticación
const auth = getAuth(app);
const db = getFirestore(app);

// Crear un proveedor de autenticación de Google
const provider = new GoogleAuthProvider();

export { auth, provider, db };
