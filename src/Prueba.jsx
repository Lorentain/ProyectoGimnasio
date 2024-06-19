import { useState } from "react";
import { Link } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import BaseDatos from "./basedatos";

const provider = new GoogleAuthProvider();

function Prueba() {

    const [usuarioActivo, setUsuarioActivo] = useState(null);

    function loginGoogle() {
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                setUsuarioActivo(user);
                console.log("Login correcto" + user);
                console.log(user.uid)
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    function logoutGoogle() {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Logout correcto")
            setUsuarioActivo(null);
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <>
            <h1>Página de Prueba</h1>
            <Link to="/">Ruta de Inicio</Link>
            <Link to="/prueba">Ruta de Prueba</Link>
            <Link to="/basedatos">Ruta de BaseDatos</Link>
            <h1>Usuario Activo: {usuarioActivo ? usuarioActivo.displayName : "Ninguno"}</h1>
            <h3 onClick={loginGoogle}>Login Google</h3>
            <h3 onClick={logoutGoogle}>Logout Google</h3>
        </>
    )
}

export default Prueba